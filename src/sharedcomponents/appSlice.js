import { createSlice } from "@reduxjs/toolkit";
import api from "../features/api/axios";

function parseBloodType(type) {
  const rh = type.includes("+") ? "+" : "-";
  const abo = type.replace(/[+-]/, "");
  const antigens = new Set(abo === "O" ? [] : abo.split(""));
  return { abo, rh, antigens };
}

const initialState = {
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
    setRegisterRole(state, action) {
      state.registerRole = action.payload;
    },
  },
});

export const { updateToasts, setIsReserving, setRegisterRole } =
  appSlice.actions;

export function handleLogout(navigate) {
  return async function (dispatch) {
    // dispatch(specifyUserInfo(null));
    navigate("/");
    dispatch(
      showToast("خروج از سیستم", "نشست شما با موفقیت خاتمه یافت.", "info"),
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
