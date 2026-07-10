import { createSlice } from "@reduxjs/toolkit";
import { useUserInfo } from "./useUserInfo";
import { useRequests } from "./useRequests";

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
    updateReservations(state, action) {
      state.reservations = action.payload;
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

export function handleConfirmDonation(resId) {
  return async function (dispatch, getState) {
    dispatch(
      updateReservations(
        getState().app.reservations.map((r) => {
          if (r.id === resId) {
            return { ...r, status: "approved" };
          }
          return r;
        }),
      ),
    );

    dispatch(
      showToast(
        "تایید موفق اهدای خون",
        `اهداکننده تایید گردید. فرد به علت اهدا، به مدت ۱ ماه در وضعیت نقاهت خواهد بود.`,
        "success",
      ),
    );
  };
}

export function handleResolveNeed() {
  return async function (dispatch) {
    // refetch needs from back
    // dispatch(
    //   updateNeeds(
    //     getState().app.needs.map((need) => {
    //       if (need.id === needId) {
    //         return { ...need, status: "completed" };
    //       }
    //       return need;
    //     }),
    //   ),
    // );

    dispatch(
      showToast(
        "نیاز برطرف شد",
        "وضعیت این درخواست به 'تکمیل شده' تغییر یافت و آرشیو شد.",
        "success",
      ),
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

export function handleReserve(needId) {
  return async function (dispatch, getState) {
    const { needs } = useRequests();
    const { data: userInfo } = useUserInfo();
    const need = needs.find((n) => n.id === needId);
    if (!need) return;

    if (userInfo.lockoutUntil && new Date(userInfo.lockoutUntil) > new Date()) {
      const now = new Date();
      const lockoutUntil = new Date(userInfo.lockoutUntil);
      const diffMs = lockoutUntil - now;
      const daysLeft =
        diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;

      dispatch(
        showToast(
          "عدم امکان ثبت رزرو",
          `به دلیل اهدای اخیر، شما در دوران نقاهت به سر می‌برید و تا ${daysLeft} روز آینده نمیتوانید خون اهدا کنید.`,
          "error",
        ),
      );
      return;
    }

    if (need.quantityRemaining <= 0) {
      dispatch(
        showToast(
          "عدم ظرفیت",
          "متاسفانه ظرفیت این درخواست تکمیل شده است.",
          "error",
        ),
      );
      return;
    }

    const donor = parseBloodType(userInfo?.profile?.blood_group);
    const recipient = parseBloodType(need.bloodTypeRequired);

    if (need.needType === "خون کامل") {
      const antigenOk = [...donor.antigens].every((ag) =>
        recipient.antigens.has(ag),
      );
      const rhOk = donor.rh === "-" || recipient.rh === "+";
      if (!antigenOk || !rhOk) {
        dispatch(
          showToast(
            "عدم تطابق گروه خونی",
            `شما با گروه خونی ${userInfo?.profile?.blood_group} نمیتوانید به فردی با گروه خونی ${need.bloodTypeRequired} خون اهدا کنید`,
            "error",
          ),
        );
        return;
      }
    }

    if (need.needType === "پلاسما" || need.needType === "پلاکت") {
      const antigenOk = [...recipient.antigens].every((ag) =>
        donor.antigens.has(ag),
      );
      const rhOk = recipient.rh === "+" || donor.rh === "-";
      if (!antigenOk || !rhOk) {
        dispatch(
          showToast(
            "عدم تطابق گروه خونی",
            `شما با گروه خونی ${userInfo?.profile?.blood_group} نمیتوانید به فردی با گروه خونی ${need.bloodTypeRequired} ${need.needType} اهدا کنید`,
            "error",
          ),
        );
        return;
      }
    }

    dispatch(setIsReserving(true));

    const donorId = userInfo?.user?.id;
    const donorName =
      userInfo?.profile?.first_name + " " + userInfo?.profile?.last_name;
    const donorPhone = userInfo?.profile?.mobile_number;
    const donorBloodType = userInfo?.profile?.blood_group;

    const updatedNeeds = needs.map((n) => {
      if (n.id === needId) {
        return {
          ...n,
          quantityRemaining: n.quantityRemaining - 1,
        };
      }
      return n;
    });

    const newReservation = {
      id: "res-" + Date.now(),
      medicalNeedId: needId,
      donorId: donorId,
      donorName: donorName,
      donorPhone: donorPhone,
      donorBloodType: donorBloodType,
      reservedQuantity: 1,
      status: "registered",
      createdAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 5000));
    dispatch(
      doReservation(updatedNeeds, [
        newReservation,
        ...getState().app.reservations,
      ]),
    );
    dispatch(
      showToast(
        "رزرو با موفقیت ثبت شد",
        `نوبت شما ثبت گردید. همکاران ما در ${need.hospitalName} با شما تماس خواهند گرفت.`,
        "success",
      ),
    );
    dispatch(setIsReserving(false));
  };
}

export default appSlice.reducer;
