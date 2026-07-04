import { createSlice } from "@reduxjs/toolkit";

// ==========================================
// MOCK DATABASE & SEED DATA
// ==========================================

const INITIAL_NEEDS = [
  {
    id: "need-1",
    title: "نیاز مبرم به خون O+ جهت عمل جراحی قلب اورژانسی",
    hospitalId: "H-110",
    hospitalName: "بیمارستان امام خمینی",
    needType: "خون کامل",
    bloodTypeRequired: "O+",
    quantityRequired: 5,
    quantityRemaining: 1,
    region: "تهران - مرکز",
    phone: "021-61190000",
    address: "تهران، انتهای بلوار کشاورز، مجتمع بیمارستانی امام خمینی",
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
  {
    id: "need-2",
    title: "درخواست فوری پلاکت A- برای بیمار بخش آنکولوژی",
    hospitalId: "H-120",
    hospitalName: "بیمارستان شریعتی",
    needType: "پلاکت",
    bloodTypeRequired: "A-",
    quantityRequired: 3,
    quantityRemaining: 3,
    region: "تهران - شمال",
    phone: "021-84901000",
    address: "تهران، خیابان کارگر شمالی، تقاطع بزرگراه جلال آل احمد",
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
  },
  {
    id: "need-3",
    title: "کمبود شدید کیسه پلاسمای B+ جهت بیماران سوانح و سوختگی",
    hospitalId: "H-130",
    hospitalName: "بیمارستان سینا",
    needType: "پلاسما",
    bloodTypeRequired: "B+",
    quantityRequired: 10,
    quantityRemaining: 0,
    region: "تهران - جنوب",
    phone: "021-66701041",
    address: "تهران، میدان امام خمینی، خیابان امام خمینی",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago (Expired / Completed)
  },
  {
    id: "need-4",
    title: "نیاز فوری به خون AB- برای مادر باردار در اتاق عمل",
    hospitalId: "H-110",
    hospitalName: "بیمارستان امام خمینی",
    needType: "خون کامل",
    bloodTypeRequired: "AB-",
    quantityRequired: 2,
    quantityRemaining: 2,
    region: "تهران - مرکز",
    phone: "021-61190000",
    address: "تهران، انتهای بلوار کشاورز، مجتمع بیمارستانی امام خمینی",
    status: "active",
    createdAt: new Date().toISOString(), // Just now
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
    status: "registered", // registered, approved, cancelled
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const PRE_DEFINED_HOSPITALS = {
  "H-110": {
    name: "بیمارستان امام خمینی",
    address: "تهران، انتهای بلوار کشاورز",
    postalCode: "1419733141",
    phone: "021-61190000",
  },
  "H-120": {
    name: "بیمارستان شریعتی",
    address: "تهران، خیابان کارگر شمالی، تقاطع جلال آل احمد",
    postalCode: "1411713135",
    phone: "021-84901000",
  },
  "H-130": {
    name: "بیمارستان سینا",
    address: "تهران، میدان امام خمینی، خیابان امام خمینی",
    postalCode: "1136746911",
    phone: "021-66701041",
  },
};

const initialState = {
  // Navigation & Role states
  userRole: null,
  currentUser: null,

  // Core Data States
  needs: INITIAL_NEEDS,
  reservations: INITIAL_RESERVATIONS,

  // Simulation parameters
  raceConditionMode: "pessimistic",
  simulatingLock: false,
  concurrencyLog: [],

  // Custom Toasts system
  toasts: [],

  // Forms states
  loginForm: {
    id: "",
    password: "",
    role: "donor",
  },

  // Dynamic Validation indicators
  passStrength: {
    length: false,
    upperLower: false,
    number: false,
    special: false,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Analyze password strength dynamically
    checkPasswordStrength: {
      prepare(pass) {
        return {
          payload: {
            length: pass.length >= 8,
            upperLower: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[^A-Za-z0-9]/.test(pass),
          },
        };
      },
      reducer(state, action) {
        state.passStrength = action.payload;
      },
    },
    updateToasts(state, action) {
      state.toasts = action.payload;
    },
    startSimLock(state, action) {
      state.simulatingLock = true;
      state.concurrencyLog = action.payload;
    },
    stopSimLock(state, action) {
      state.concurrencyLog = action.payload;
      state.simulatingLock = false;
    },
    updateNeeds(state, action) {
      state.needs = action.payload;
    },
    specifyUserInfo: {
      prepare(userObj, userRole) {
        return {
          payload: { userObj, userRole },
        };
      },
      reducer(state, action) {
        state.currentUser = action.payload.userObj;
        state.userRole = action.payload.userRole;
      },
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
      prepare(updatedNeeds, updatedReservations, reportedLogs) {
        return {
          payload: {
            updatedNeeds,
            updatedReservations,
            reportedLogs,
          },
        };
      },
      reducer(state, action) {
        state.needs = action.payload.updatedNeeds;
        state.reservations = action.payload.updatedReservations;
        state.concurrencyLog = action.payload.reportedLogs;
        state.simulatingLock = false;
      },
    },
    updateLoginForm(state, action) {
      state.loginForm = action.payload;
    },
    clearConcurLog(state) {
      state.concurrencyLog = [];
    },
    updateReservations(state, action) {
      state.reservations = action.payload;
    },

    setRaceConditionMode(state, action) {
      state.raceConditionMode = action.payload;
    },
  },
});

export const {
  checkPasswordStrength,
  updateToasts,
  startSimLock,
  stopSimLock,
  updateNeeds,
  specifyUserInfo,
  cancelReservation,
  doReservation,
  updateLoginForm,
  clearConcurLog,
  updateReservations,
  setRaceConditionMode,
} = appSlice.actions;

export function handleLogout(navigate) {
  return async function (dispatch) {
    dispatch(specifyUserInfo(null, null));
    navigate("/");
    dispatch(
      showToast("خروج از سیستم", "نشست شما با موفقیت خاتمه یافت.", "info"),
    );
  };
}

// Staff confirms the donor actually donated
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

// Quick login helpers for Demo/Guest state
export function quickLoginAsStaff() {
  const mockStaff = {
    id: "H-110",
    name: "بیمارستان امام خمینی (نمونه)",
    address: "تهران، انتهای بلوار کشاورز",
    phone: "021-61190000",
    postalCode: "1419733141",
  };

  return async function (dispatch) {
    dispatch(specifyUserInfo(mockStaff, "staff"));
    dispatch(
      showToast(
        "ورود سریع کادر درمان",
        "شما به عنوان مسئول بخش اورژانس بیمارستان امام خمینی وارد شدید.",
        "success",
      ),
    );
  };
}

// Staff closes/resolves a full medical need request
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

// Staff creates new request
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

    const hospitalId = getState().app.currentUser?.id || "H-110";
    const hospitalName =
      getState().app.currentUser?.name || "بیمارستان امام خمینی (مهمان)";
    const phone = getState().app.currentUser?.phone || "021-61190000";
    const address =
      getState().app.currentUser?.address || "تهران، انتهای بلوار کشاورز";

    const newNeed = {
      id: "need-" + Date.now(),
      title: newNeedForm.title,
      hospitalId: hospitalId,
      hospitalName: hospitalName,
      needType: newNeedForm.needType,
      bloodTypeRequired: newNeedForm.bloodTypeRequired,
      quantityRequired: Number(newNeedForm.quantityRequired),
      quantityRemaining: Number(newNeedForm.quantityRequired),
      region: newNeedForm.region,
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

// Register Medical Center / Staff
export function handleStaffRegister(staffRegForm, navigate) {
  return async function (dispatch, getState) {
    if (staffRegForm.password !== staffRegForm.confirmPassword) {
      dispatch(
        showToast(
          "خطای کلمه عبور",
          "کلمه عبور و تکرار آن همخوانی ندارند.",
          "error",
        ),
      );
      return;
    }

    const isStrong =
      getState().app.passStrength.length &&
      getState().app.passStrength.upperLower &&
      getState().app.passStrength.number &&
      getState().app.passStrength.special;
    if (!isStrong) {
      dispatch(
        showToast(
          "خطای کلمه عبور ضعیف",
          "کلمه عبور باید شرایط ۸ کاراکتری را دارا باشد.",
          "error",
        ),
      );
      return;
    }

    const newStaff = {
      id: staffRegForm.hospitalId,
      name: staffRegForm.hospitalName,
      address: staffRegForm.address,
      phone: staffRegForm.phone,
      postalCode: staffRegForm.postalCode,
    };

    dispatch(specifyUserInfo(newStaff, "staff"));
    navigate("/staff-dashboard");
    dispatch(
      showToast(
        "ثبت بیمارستان موفقیت‌آمیز بود",
        "دسترسی مدیریت بیمارستان شما فعال گردید.",
        "success",
      ),
    );
  };
}

// Postal code simulation autofill address
export function handlePostalCodeChange(code, setStaffRegForm) {
  setStaffRegForm((prev) => ({ ...prev, postalCode: code }));

  return async function (dispatch) {
    if (code.length === 10) {
      setStaffRegForm((prev) => ({
        ...prev,
        address:
          prev.address || "تهران، منطقه پستی معتبر، خیابان آزادی، پلاک ۱۱۰",
      }));
      dispatch(
        showToast(
          "بررسی کد پستی",
          "آدرس بر اساس کد پستی به صورت تقریبی شناسایی شد.",
          "info",
        ),
      );
    }
  };
}

// Autofill hospital info on Registration
export function handleHospitalIdChange(id, setStaffRegForm) {
  setStaffRegForm((prev) => {
    const hospital = PRE_DEFINED_HOSPITALS[id] || {
      name: "",
      address: "",
      postalCode: "",
      phone: "",
    };
    return {
      ...prev,
      hospitalId: id,
      hospitalName: hospital.name,
      address: hospital.address,
      postalCode: hospital.postalCode,
      phone: hospital.phone,
    };
  });

  return async function (dispatch) {
    if (PRE_DEFINED_HOSPITALS[id]) {
      dispatch(
        showToast(
          "اطلاعات مرکز درمانی یافت شد",
          `سیستم اطلاعات مربوط به ${PRE_DEFINED_HOSPITALS[id].name} را به صورت خودکار بارگذاری کرد.`,
          "info",
        ),
      );
    }
  };
}

// Register Donor
export function handleDonorRegister(donorRegForm, navigate) {
  return async function (dispatch, getState) {
    if (donorRegForm.password !== donorRegForm.confirmPassword) {
      dispatch(
        showToast(
          "خطای کلمه عبور",
          "کلمه عبور و تکرار آن همخوانی ندارند.",
          "error",
        ),
      );
      return;
    }

    const isStrong =
      getState().app.passStrength.length &&
      getState().app.passStrength.upperLower &&
      getState().app.passStrength.number &&
      getState().app.passStrength.special;
    if (!isStrong) {
      dispatch(
        showToast(
          "خطای کلمه عبور ضعیف",
          "کلمه عبور باید شرایط ۸ کاراکتری و پیچیدگی را دارا باشد.",
          "error",
        ),
      );
      return;
    }

    const newDonor = {
      id: "donor-" + Date.now(),
      name: donorRegForm.name,
      nationalId: donorRegForm.nationalId,
      bloodType: donorRegForm.bloodType,
      region: donorRegForm.region,
      mobile: donorRegForm.mobile,
      canDonate: true,
      lockoutUntil: null,
    };

    dispatch(specifyUserInfo(newDonor, "donor"));
    navigate("/donor-dashboard");
    dispatch(
      showToast(
        "عضویت موفقیت‌آمیز",
        `${newDonor.name} عزیز، خوش آمدید.`,
        "success",
      ),
    );
  };
}

// Authenticate user
export function handleLogin(navigate) {
  return async function (dispatch, getState) {
    if (getState().app.loginForm.role === "donor") {
      if (getState().app.loginForm.id.length !== 10) {
        dispatch(
          showToast("خطا در ورود", "کد ملی باید دقیقاً ۱۰ رقم باشد.", "error"),
        );
        return;
      }
      const mockDonor = {
        id: "donor-1",
        name: "علیرضا رضایی",
        nationalId: getState().app.loginForm.id,
        bloodType: "O+",
        region: "تهران - مرکز",
        mobile: "09121111111",
        canDonate: true,
        lockoutUntil: null,
      };
      dispatch(specifyUserInfo(mockDonor, "donor"));
      navigate("/donor-dashboard");
      dispatch(
        showToast("خوش آمدید", `به عنوان اهداکننده وارد شدید.`, "success"),
      );
    } else {
      const mockStaff = {
        id: getState().app.loginForm.id || "H-110",
        name:
          PRE_DEFINED_HOSPITALS[getState().app.loginForm.id]?.name ||
          "بیمارستان امام خمینی",
        address:
          PRE_DEFINED_HOSPITALS[getState().app.loginForm.id]?.address ||
          "تهران، انتهای بلوار کشاورز",
        phone:
          PRE_DEFINED_HOSPITALS[getState().app.loginForm.id]?.phone ||
          "021-61190000",
        postalCode:
          PRE_DEFINED_HOSPITALS[getState().app.loginForm.id]?.postalCode ||
          "1419733141",
      };
      dispatch(specifyUserInfo(mockStaff, "staff"));
      navigate("/staff-dashboard");
      dispatch(
        showToast(
          "ورود موفقیت‌آمیز مسئول",
          `وارد پنل مدیریت ${mockStaff.name} شدید.`,
          "success",
        ),
      );
    }
  };
}

// Donor cancels their own reservation
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

// Quick login helpers for Demo/Guest state
export function quickLoginAsDonor() {
  const mockDonor = {
    id: "donor-demo",
    name: "علیرضا رضایی (نمونه)",
    nationalId: "0012345678",
    bloodType: "O+",
    region: "تهران - مرکز",
    mobile: "09121111111",
    canDonate: true,
    lockoutUntil: null,
  };

  return async function (dispatch) {
    dispatch(specifyUserInfo(mockDonor, "donor"));
    dispatch(
      showToast(
        "ورود سریع اهداکننده",
        "شما به عنوان اهداکننده نمونه وارد سیستم شدید.",
        "success",
      ),
    );
  };
}

// Simulating the 2-day expiration of requests (time-lapse simulation)
export function triggerTimeLapse() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago

  return async function (dispatch, getState) {
    const updated = getState().app.needs.map((need) => {
      const needTime = new Date(need.createdAt).getTime();
      if (needTime < cutoff && need.status === "active") {
        return { ...need, status: "expired" };
      }
      return need;
    });
    dispatch(updateNeeds(updated));
    dispatch(
      showToast(
        "شبیه‌سازی گذر زمان ۲ روزه",
        "درخواست‌های فعال و رزرو نشده قدیمی منقضی و بایگانی شدند.",
        "warning",
      ),
    );
  };
}

// Add a Toast Helper
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

// Handle Reservation with Simulated Database Transaction & Race Conditions
export function handleReserve(needId) {
  return async function (dispatch, getState) {
    const need = getState().app.needs.find((n) => n.id === needId);
    if (!need) return;

    if (
      getState().app.currentUser?.lockoutUntil &&
      new Date(getState().app.currentUser.lockoutUntil) > new Date()
    ) {
      dispatch(
        showToast(
          "عدم امکان ثبت رزرو",
          "به دلیل اهدای اخیر، شما در دوران نقاهت به سر می‌برید.",
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

    const logs = [];
    logs.push(`[تراکنش] شروع پروسه رزرو برای درخواست شناسه ${needId}`);
    logs.push(
      `[خواندن داده] خواندن ظرفیت باقیمانده برای ${need.hospitalName}... مقدار فعلی: ${need.quantityRemaining}`,
    );
    dispatch(startSimLock([...logs]));

    // Simulate Network/DB latency to trigger Race Condition simulations
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Handle guest donor metadata dynamically if not logged in
    const donorId = getState().app.currentUser?.id || "guest-donor";
    const donorName =
      getState().app.currentUser?.name || "کاربر مهمان (سیستم خودکار)";
    const donorPhone = getState().app.currentUser?.mobile || "۰۹۱۲۰۰۰۰۰۰۰";
    const donorBloodType =
      getState().app.currentUser?.bloodType || need.bloodTypeRequired;

    if (getState().app.raceConditionMode === "none") {
      logs.push(
        `[هشدار] بدون قفل پایگاه داده (No Lock). در حال شبیه‌سازی درخواست همزمان...`,
      );
      logs.push(`[انجام تراکنش] تراکنش با موفقیت صوری انجام شد.`);

      const updatedNeeds = getState().app.needs.map((n) => {
        if (n.id === needId) {
          const rem = n.quantityRemaining - 1;
          return { ...n, quantityRemaining: Math.max(0, rem) };
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

      logs.push(`[پایان تراکنش] رکورد رزرو با موفقیت ثبت شد.`);

      dispatch(
        doReservation(
          updatedNeeds,
          [newReservation, ...getState().app.reservations],
          [...logs],
        ),
      );
      dispatch(
        showToast(
          "رزرو با موفقیت ثبت شد",
          `نوبت شما ثبت گردید. همکاران ما در ${need.hospitalName} با شما تماس خواهند گرفت.`,
          "success",
        ),
      );
    } else if (getState().app.raceConditionMode === "pessimistic") {
      logs.push(
        `[قفل بدبینانه] اعمال قفل انحصاری (FOR UPDATE) روی ردیف درخواست ${needId}`,
      );
      logs.push(`[امنیت] سایر درخواست‌های همزمان در صف انتظار مسدود شدند.`);

      if (need.quantityRemaining > 0) {
        logs.push(`[بررسی ظرفیت] ظرفیت امن تایید شد. ۱ واحد کسر می‌شود.`);

        const updatedNeeds = getState().app.needs.map((n) => {
          if (n.id === needId) {
            return { ...n, quantityRemaining: n.quantityRemaining - 1 };
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

        logs.push(
          `[ثبت] رزرو با موفقیت اضافه شد. ردیف پایگاه داده آزاد شد (Unlock).`,
        );
        dispatch(
          doReservation(
            updatedNeeds,
            [newReservation, ...getState().app.reservations],
            [...logs],
          ),
        );
        dispatch(
          showToast(
            "رزرو نوبت موفق (قفل ایمن)",
            `ظرفیت به صورت اتمیک برای شما قفل و ثبت شد.`,
            "success",
          ),
        );
      } else {
        logs.push(
          `[خطا] ظرفیت در حین قفل متقابل تمام شد! تراکنش با موفقیت به عقب برگشت (Rollback).`,
        );
        dispatch(
          showToast(
            "ظرفیت تکمیل شده است",
            "تراکنش به علت عدم ظرفیت لغو شد و اطلاعات آسیب ندید.",
            "error",
          ),
        );
        dispatch(stopSimLock([...logs]));
      }
    } else if (getState().app.raceConditionMode === "optimistic") {
      logs.push(
        `[قفل خوش‌بینانه] خواندن نسخه فعلی رکورد: نسخه (v${need.quantityRemaining + 1})`,
      );
      logs.push(
        `[شبیه‌سازی] تداخل همزمان کشف شد! کاربر دیگری نسخه را تغییر داده است.`,
      );
      logs.push(
        `[خطا] نسخه همخوانی ندارد! خطای Race Condition رخ داد. عملیات Rollback انجام می‌شود.`,
      );

      dispatch(
        showToast(
          "خطای تداخل همزمانی!",
          "سیستم برای جلوگیری از اختصاص بیجا، تراکنش را متوقف کرد. مجدداً تلاش کنید.",
          "error",
        ),
      );
      dispatch(stopSimLock([...logs]));
    }
  };
}

export default appSlice.reducer;
