import { createSlice } from "@reduxjs/toolkit";
import api from "../features/api/axios";

const INITIAL_RESERVATIONS = [
  {
    id: "res-1",
    medicalNeedId: "need-1",
    donorId: "donor-1",
    donorName: "احسان علوی",
    donorPhone: "09123456789",
    donorBloodType: "O+",
    reservedQuantity: 1,
    status: "registered",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

function parseBloodType(type) {
  const rh = type.includes("+") ? "+" : "-";
  const abo = type.replace(/[+-]/, "");
  const antigens = new Set(abo === "O" ? [] : abo.split(""));
  return { abo, rh, antigens };
}

const initialState = {
  reservations: INITIAL_RESERVATIONS,

  isReserving: false,

  toasts: [],

  registerRole: "donor",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateToasts(state, action) {
      state.toasts = action.payload;
    },
    setIsReserving(state, action) {
      state.isReserving = action.payload;
    },
    cancelReservation(state, action) {
      const res = state.reservations.find((r) => r.id === action.payload);
      if (!res) return;
      // refetch needs from back
      // state.needs = state.needs.map((need) => {
      //   if (need.id === res.medicalNeedId) {
      //     return {
      //       ...need,
      //       quantityRemaining: Math.min(
      //         need.quantityRequired,
      //         need.quantityRemaining + 1,
      //       ),
      //     };
      //   }
      //   return need;
      // });
      state.reservations = state.reservations.map((r) => {
        if (r.id === action.payload) {
          return { ...r, status: "cancelled" };
        }
        return r;
      });
    },
    doReservation: {
      prepare(updatedNeeds, updatedReservations) {
        return {
          payload: {
            updatedNeeds,
            updatedReservations,
          },
        };
      },
      reducer(state, action) {
        // refetch needs from back
        // state.needs = action.payload.updatedNeeds;
        state.reservations = action.payload.updatedReservations;
      },
    },
    setRegisterRole(state, action) {
      state.registerRole = action.payload;
    },
  },
});

export const {
  updateToasts,
  setIsReserving,
  specifyUserInfo,
  cancelReservation,
  doReservation,
  updateReservations,
  setRegisterRole,
} = appSlice.actions;

export function handleLogout(navigate) {
  return async function (dispatch) {
    dispatch(specifyUserInfo(null));
    navigate("/");
    dispatch(
      showToast("خروج از سیستم", "نشست شما با موفقیت خاتمه یافت.", "info"),
    );
  };
}

export function handleCreateNeed(newNeedForm, navigate) {
  return async function (dispatch) {
    if (newNeedForm.quantityRequired <= 0) {
      dispatch(
        showToast(
          "ظرفیت نامعتبر",
          "ظرفیت درخواستی باید حداقل ۱ باشد.",
          "error",
        ),
      );
      return;
    }
    // refetch needs from back
    // const centerId = userInfo?.user?.id || "CTR-110";
    // const phone = userInfo?.profile?.mobile_number || "021-61190000";
    // const address = "تهران، انتهای بلوار کشاورز";
    // const hospitalName = "بیمارستان امام خمینی (مهمان)";
    // const newNeed = {
    //   id: "need-" + Date.now(),
    //   title: newNeedForm.title,
    //   centerId: centerId,
    //   hospitalName: hospitalName,
    //   needType: newNeedForm.needType,
    //   bloodTypeRequired: newNeedForm.bloodTypeRequired,
    //   quantityRequired: Number(newNeedForm.quantityRequired),
    //   quantityRemaining: Number(newNeedForm.quantityRequired),
    //   province: newNeedForm.province,
    //   phone: phone,
    //   address: address,
    //   status: "active",
    //   createdAt: new Date().toISOString(),
    // };
    // dispatch(updateNeeds([newNeed, ...getState().app.needs]));
    navigate("/staff-dashboard");
    dispatch(
      showToast(
        "ثبت درخواست جدید اورژانسی",
        "درخواست شما بلافاصله در سامانه و داشبورد اهداکنندگان منتشر شد.",
        "success",
      ),
    );
  };
}

export function handleCancelReservation(resId) {
  return async function (dispatch) {
    dispatch(cancelReservation(resId));
    dispatch(
      showToast(
        "لغو رزرو",
        "درخواست شما با موفقیت لغو و ظرفیت آزاد شد.",
        "warning",
      ),
    );
  };
}

export function showToast(title, message, type = "success") {
  const id = Date.now();

  return async function (dispatch, getState) {
    const addedToast = [...getState().app.toasts, { id, title, message, type }];
    const deletedToast = [...getState().app.toasts.filter((t) => t.id !== id)];
    dispatch(updateToasts(addedToast));
    setTimeout(() => {
      dispatch(updateToasts(deletedToast));
    }, 5000);
  };
}

export function handleReserve(
  needId,
  bloodType,
  remaining,
  hospitalName,
  province,
  userInfo,
  queryClient,
) {
  return async function (dispatch) {
    const donor = parseBloodType(userInfo?.profile?.blood_group);
    const recipient = parseBloodType(bloodType);

    const antigenOk = [...donor.antigens].every((ag) =>
      recipient.antigens.has(ag),
    );
    const rhOk = donor.rh === "-" || recipient.rh === "+";

    if (remaining <= 0) {
      dispatch(
        showToast(
          "عدم ظرفیت",
          "متاسفانه ظرفیت این درخواست تکمیل شده است.",
          "error",
        ),
      );
      return;
    }

    if (!antigenOk || !rhOk) {
      dispatch(
        showToast(
          "عدم تطابق گروه خونی",
          `شما با گروه خونی ${userInfo?.profile?.blood_group} نمیتوانید به فردی با گروه خونی ${bloodType} خون اهدا کنید`,
          "error",
        ),
      );
      return;
    }

    dispatch(setIsReserving(true));

    const payload = {
      pk: needId,
    };
    try {
      await api.post(`/blood/requests/${needId}/donate/`, payload);

      dispatch(
        showToast(
          "رزرو با موفقیت ثبت شد",
          `نوبت شما ثبت گردید. همکاران ما در ${hospitalName} با شما تماس خواهند گرفت.`,
          "success",
        ),
      );

      await queryClient.invalidateQueries({
        queryKey: ["fetch_filtered_needs"],
      });
      await queryClient.invalidateQueries(["fetch_needs"]);
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.message.includes("400")
        ? "شما قبلا این درخواست را رزرو کرده بودید"
        : error.message.includes("Network Error")
          ? "خطا در اتصال به اینترنت"
          : "مشکلی پیش آمد. لطفا دوباره تلاش کنید.";
      dispatch(showToast("خطا در رزرو", errorMessage, "error"));
    } finally {
      dispatch(setIsReserving(false));
    }
  };
}

export default appSlice.reducer;
