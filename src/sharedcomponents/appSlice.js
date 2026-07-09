import { createSlice } from "@reduxjs/toolkit";

const INITIAL_NEEDS = [
  {
    id: "need-1",
    title: "نیاز مبرم به خون O+ جهت عمل جراحی قلب اورژانسی",
    centerId: "CTR-110",
    hospitalName: "بیمارستان امام خمینی",
    needType: "خون کامل",
    bloodTypeRequired: "O+",
    quantityRequired: 5,
    quantityRemaining: 1,
    province: "تهران",
    phone: "021-61190000",
    address: "تهران، انتهای بلوار کشاورز، مجتمع بیمارستانی امام خمینی",
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "need-2",
    title: "درخواست فوری پلاکت A- برای بیمار بخش آنکولوژی",
    centerId: "CTR-120",
    hospitalName: "بیمارستان شریعتی",
    needType: "پلاکت",
    bloodTypeRequired: "A-",
    quantityRequired: 3,
    quantityRemaining: 3,
    province: "البرز",
    phone: "021-84901000",
    address: "تهران، خیابان کارگر شمالی، تقاطع بزرگراه جلال آل احمد",
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "need-3",
    title: "کمبود شدید کیسه پلاسمای B+ جهت بیماران سوانح و سوختگی",
    centerId: "CTR-130",
    hospitalName: "بیمارستان سینا",
    needType: "پلاسما",
    bloodTypeRequired: "B+",
    quantityRequired: 10,
    quantityRemaining: 0,
    province: "اصفهان",
    phone: "021-66701041",
    address: "تهران، میدان امام خمینی، خیابان امام خمینی",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "need-4",
    title: "نیاز فوری به خون AB- برای مادر باردار در اتاق عمل",
    centerId: "CTR-110",
    hospitalName: "بیمارستان امام خمینی",
    needType: "خون کامل",
    bloodTypeRequired: "AB-",
    quantityRequired: 2,
    quantityRemaining: 2,
    province: "تهران",
    phone: "021-61190000",
    address: "تهران، انتهای بلوار کشاورز، مجتمع بیمارستانی امام خمینی",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

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
  userRole: null,
  currentUser: null,

  needs: INITIAL_NEEDS,
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
    updateNeeds(state, action) {
      state.needs = action.payload;
    },
    specifyUserInfo(state, action) {
      state.currentUser = action.payload;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    cancelReservation(state, action) {
      const res = state.reservations.find((r) => r.id === action.payload);
      if (!res) return;
      state.needs = state.needs.map((need) => {
        if (need.id === res.medicalNeedId) {
          return {
            ...need,
            quantityRemaining: Math.min(
              need.quantityRequired,
              need.quantityRemaining + 1,
            ),
          };
        }
        return need;
      });
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
        state.needs = action.payload.updatedNeeds;
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
  updateNeeds,
  specifyUserInfo,
  setUserRole,
  cancelReservation,
  doReservation,
  updateReservations,
  setRegisterRole,
} = appSlice.actions;

export function handleLogout(navigate) {
  return async function (dispatch) {
    dispatch(specifyUserInfo(null));
    dispatch(setUserRole(null));
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

export function handleResolveNeed(needId) {
  return async function (dispatch, getState) {
    dispatch(
      updateNeeds(
        getState().app.needs.map((need) => {
          if (need.id === needId) {
            return { ...need, status: "completed" };
          }
          return need;
        }),
      ),
    );

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
  return async function (dispatch, getState) {
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

    const centerId = getState().app.currentUser?.id || "CTR-110";
    const phone = getState().app.currentUser?.phone || "021-61190000";
    const address = "تهران، انتهای بلوار کشاورز";
    const hospitalName = "بیمارستان امام خمینی (مهمان)";

    const newNeed = {
      id: "need-" + Date.now(),
      title: newNeedForm.title,
      centerId: centerId,
      hospitalName: hospitalName,
      needType: newNeedForm.needType,
      bloodTypeRequired: newNeedForm.bloodTypeRequired,
      quantityRequired: Number(newNeedForm.quantityRequired),
      quantityRemaining: Number(newNeedForm.quantityRequired),
      province: newNeedForm.province,
      phone: phone,
      address: address,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    dispatch(updateNeeds([newNeed, ...getState().app.needs]));
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
    const need = getState().app.needs.find((n) => n.id === needId);
    if (!need) return;

    if (
      getState().app.currentUser?.lockoutUntil &&
      new Date(getState().app.currentUser.lockoutUntil) > new Date()
    ) {
      const now = new Date();
      const lockoutUntil = new Date(getState().app.currentUser.lockoutUntil);
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

    const donor = parseBloodType(getState().app.currentUser.bloodType);
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
            `شما با گروه خونی ${getState().app.currentUser.bloodType} نمیتوانید به فردی با گروه خونی ${need.bloodTypeRequired} خون اهدا کنید`,
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
            `شما با گروه خونی ${getState().app.currentUser.bloodType} نمیتوانید به فردی با گروه خونی ${need.bloodTypeRequired} ${need.needType} اهدا کنید`,
            "error",
          ),
        );
        return;
      }
    }

    dispatch(setIsReserving(true));

    const donorId = getState().app.currentUser?.id;
    const donorName = getState().app.currentUser?.name;
    const donorPhone = getState().app.currentUser?.mobile;
    const donorBloodType = getState().app.currentUser?.bloodType;

    const updatedNeeds = getState().app.needs.map((n) => {
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
