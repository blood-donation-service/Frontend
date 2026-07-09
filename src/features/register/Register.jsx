import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { setRegisterRole, showToast } from "../../sharedcomponents/appSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { IRAN_PROVINCES } from "../../sharedcomponents/iranProvinces";

function Register() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registerRole, userRole } = useSelector((store) => store.app);

  const [donorRegForm, setDonorRegForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    mobile: "",
    bloodType: "",
    province: "",
    password: "",
    confirmPassword: "",
  });
  const [staffRegForm, setStaffRegForm] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    phone: "",
    centerId: "",
    password: "",
    confirmPassword: "",
  });
  const [donorPassStrength, setDonorPassStrength] = useState({
    length: false,
    upperLower: false,
    number: false,
    special: false,
  });
  const [staffPassStrength, setStaffPassStrength] = useState({
    length: false,
    upperLower: false,
    number: false,
    special: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const onSubmit = async () => {
    if (isRegistering) return;
    try {
      if (registerRole === "donor") {
        if (!handleDonorFrontErrors()) {
          return;
        }
      } else {
        if (!handleStaffFrontErrors()) {
          return;
        }
      }

      setIsRegistering(true);

      const payload =
        registerRole === "donor"
          ? {
              first_name: donorRegForm.firstName.trim(),
              last_name: donorRegForm.lastName.trim(),
              national_code: donorRegForm.nationalId,
              mobile_number: donorRegForm.mobile,
              blood_group: donorRegForm.bloodType,
              province: donorRegForm.province,
              password: donorRegForm.password,
            }
          : {
              first_name: staffRegForm.firstName.trim(),
              last_name: staffRegForm.lastName.trim(),
              national_code: staffRegForm.nationalCode,
              mobile_number: staffRegForm.phone,
              center_id: staffRegForm.centerId.trim(),
              password: staffRegForm.password,
            };

      const response =
        registerRole === "donor"
          ? await api.post("/api/auth/register/donor/", payload)
          : await api.post("/api/auth/register/staff/", payload);

      if (registerRole === "donor")
        dispatch(
          showToast(
            "عضویت موفقیت‌آمیز",
            `${`${response.data?.profile?.first_name ?? ""} ${response.data?.profile?.last_name ?? ""}`} عزیز، خوش آمدید. اکنون وارد شوید.`,
            "success",
          ),
        );
      else {
        dispatch(
          showToast(
            "ثبت نام موفقیت‌آمیز بود",
            `در صورت تایید توسط همکاران ما میتوانید وارد شوید`,
            "success",
          ),
        );
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "خطا در ثبت نام. لطفاً دوباره تلاش کنید.";
      dispatch(showToast("خطا در ثبت نام", errorMessage, "error"));
    } finally {
      setIsRegistering(false);
    }
  };

  function handleDonorFrontErrors() {
    if (donorRegForm.password !== donorRegForm.confirmPassword) {
      dispatch(
        showToast(
          "خطای کلمه عبور",
          "کلمه عبور و تکرار آن همخوانی ندارند.",
          "error",
        ),
      );
      return false;
    }

    const isStrong =
      donorPassStrength.length &&
      donorPassStrength.upperLower &&
      donorPassStrength.number &&
      donorPassStrength.special;

    if (!isStrong) {
      dispatch(
        showToast(
          "خطای کلمه عبور ضعیف",
          "کلمه عبور باید شرایط ۸ کاراکتری و پیچیدگی را دارا باشد.",
          "error",
        ),
      );
      return false;
    }

    if (donorRegForm.mobile.length !== 11) {
      dispatch(
        showToast(
          "خطای شماره موبایل",
          "شماره موبایل باید 11 رقم باشد",
          "error",
        ),
      );
      return false;
    }

    if (!donorRegForm.mobile.startsWith("09")) {
      dispatch(
        showToast(
          "خطای شماره موبایل",
          "شماره موبایل باید با 09 شروع شود",
          "error",
        ),
      );
      return false;
    }

    if (donorRegForm.nationalId.length !== 10) {
      dispatch(showToast("خطای کد ملی", "کد ملی باید 10 رقم باشد", "error"));
      return false;
    }

    return true;
  }

  function handleStaffFrontErrors() {
    if (staffRegForm.password !== staffRegForm.confirmPassword) {
      dispatch(
        showToast(
          "خطای کلمه عبور",
          "کلمه عبور و تکرار آن همخوانی ندارند.",
          "error",
        ),
      );
      return false;
    }

    const isStrong =
      staffPassStrength.length &&
      staffPassStrength.upperLower &&
      staffPassStrength.number &&
      staffPassStrength.special;

    if (!isStrong) {
      dispatch(
        showToast(
          "خطای کلمه عبور ضعیف",
          "کلمه عبور باید شرایط ۸ کاراکتری را دارا باشد.",
          "error",
        ),
      );
      return false;
    }

    if (staffRegForm.phone.length !== 11) {
      dispatch(
        showToast("خطای شماره تلفن", "شماره تلفن باید 11 رقم باشد", "error"),
      );
      return false;
    }

    if (!staffRegForm.phone.startsWith("09")) {
      dispatch(
        showToast(
          "خطای شماره موبایل",
          "شماره موبایل باید با 09 شروع شود",
          "error",
        ),
      );
      return false;
    }

    if (staffRegForm.nationalCode.length !== 10) {
      dispatch(showToast("خطای کد ملی", "کد ملی باید 10 رقم باشد", "error"));
      return false;
    }

    if (!/^CTR-\d{3}$/.test(staffRegForm.centerId)) {
      dispatch(
        showToast(
          "خطای شناسه مرکز درمانی",
          "شناسه مرکز درمانی باید به فرم CTR-XXX (سه رقم) باشد",
          "error",
        ),
      );
      return false;
    }

    return true;
  }

  if (userRole) return <Navigate to="/" replace />;
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        {registerRole === "donor" ? (
          <div className="mb-6 flex flex-col gap-2 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              عضویت داوطلب اهداکننده خون
            </h3>
            <p className="text-xs text-slate-400">
              با پر کردن فرم زیر به شبکه گسترده نجات‌دهندگان بپیوندید.
            </p>
          </div>
        ) : (
          <div className="mb-6 flex flex-col gap-2 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              ثبت نام کادر درمان
            </h3>
            <p className="text-xs text-slate-400">
              اطلاعات حقوقی بیمارستان خود را جهت اخذ دسترسی مدیریت بحران تکمیل
              کنید.
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-50 p-1">
          <button
            disabled={isRegistering}
            onClick={() =>
              registerRole === "staff" && dispatch(setRegisterRole("donor"))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${registerRole === "donor" ? "bg-white text-rose-600 shadow" : isRegistering ? "cursor-wait text-slate-400" : "cursor-pointer text-slate-400 hover:text-slate-700"}`}
          >
            داوطلب اهداکننده
          </button>
          <button
            disabled={isRegistering}
            onClick={() =>
              registerRole === "donor" && dispatch(setRegisterRole("staff"))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${registerRole === "staff" ? "bg-white text-rose-600 shadow" : isRegistering ? "cursor-wait text-slate-400" : "cursor-pointer text-slate-400 hover:text-slate-700"}`}
          >
            کادر درمانی
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              نام
            </label>
            <input
              type="text"
              placeholder="مثال: علی"
              value={
                registerRole === "donor"
                  ? donorRegForm.firstName
                  : staffRegForm.firstName
              }
              {...register(
                registerRole === "donor"
                  ? "donor_firstName"
                  : "staff_firstName",
                { required: "نام الزامی است" },
              )}
              onChange={(e) => {
                if (registerRole === "donor") {
                  setDonorRegForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }));
                  setValue("donor_firstName", e.target.value, {
                    shouldValidate: true,
                  });
                } else {
                  setStaffRegForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }));
                  setValue("staff_firstName", e.target.value, {
                    shouldValidate: true,
                  });
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              نام خانوادگی
            </label>
            <input
              type="text"
              placeholder="مثال: اکبری"
              value={
                registerRole === "donor"
                  ? donorRegForm.lastName
                  : staffRegForm.lastName
              }
              {...register(
                registerRole === "donor" ? "donor_lastName" : "staff_lastName",
                {
                  required: "نام خانوادگی الزامی است",
                },
              )}
              onChange={(e) => {
                if (registerRole === "donor") {
                  setDonorRegForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }));
                  setValue("donor_lastName", e.target.value, {
                    shouldValidate: true,
                  });
                } else {
                  setStaffRegForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }));
                  setValue("staff_lastName", e.target.value, {
                    shouldValidate: true,
                  });
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کد ملی
            </label>
            <input
              type="text"
              placeholder="۱۰ رقم"
              maxLength={10}
              value={
                registerRole === "donor"
                  ? donorRegForm.nationalId
                  : staffRegForm.nationalCode
              }
              {...register(
                registerRole === "donor"
                  ? "donor_nationalId"
                  : "staff_nationalCode",
                {
                  required: "کد ملی الزامی است",
                },
              )}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  if (registerRole === "donor") {
                    setDonorRegForm((prev) => ({
                      ...prev,
                      nationalId: e.target.value.trim(),
                    }));
                    setValue("donor_nationalId", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  } else {
                    setStaffRegForm((prev) => ({
                      ...prev,
                      nationalCode: e.target.value.trim(),
                    }));
                    setValue("staff_nationalCode", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              شماره موبایل
            </label>
            <input
              type="text"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              maxLength={11}
              value={
                registerRole === "donor"
                  ? donorRegForm.mobile
                  : staffRegForm.phone
              }
              {...register(
                registerRole === "donor" ? "donor_mobile" : "staff_phone",
                {
                  required: "شماره تلفن الزامی است",
                },
              )}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  if (registerRole === "donor") {
                    setDonorRegForm((prev) => ({
                      ...prev,
                      mobile: e.target.value.trim(),
                    }));
                    setValue("donor_mobile", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  } else {
                    setStaffRegForm((prev) => ({
                      ...prev,
                      phone: e.target.value.trim(),
                    }));
                    setValue("staff_phone", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          {registerRole === "donor" ? (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  گروه خونی
                </label>
                <select
                  value={donorRegForm.bloodType}
                  {...register("donor_bloodType", {
                    required: "گروه خونی الزامی است",
                  })}
                  onChange={(e) => {
                    setDonorRegForm((prev) => ({
                      ...prev,
                      bloodType: e.target.value,
                    }));
                    setValue("donor_bloodType", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none ${donorRegForm.bloodType === "" ? "text-gray-400" : ""} ${isRegistering ? "cursor-wait" : "cursor-pointer"}`}
                  disabled={isRegistering}
                  required
                >
                  {["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                        className={`${type === "" ? "text-gray-400" : "text-black"}`}
                      >
                        {type ? `${type}` : "---انتخاب کنید---"}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  استان محل سکونت
                </label>
                <select
                  value={donorRegForm.province}
                  {...register("donor_province", {
                    required: "استان محل سکونت الزامی است",
                  })}
                  onChange={(e) => {
                    setDonorRegForm((prev) => ({
                      ...prev,
                      province: e.target.value,
                    }));
                    setValue("donor_province", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none ${donorRegForm.province === "" ? "text-gray-400" : ""} ${isRegistering ? "cursor-wait" : "cursor-pointer"}`}
                  disabled={isRegistering}
                  required
                >
                  <option value="" className="text-gray-400">
                    ---انتخاب کنید---
                  </option>
                  {IRAN_PROVINCES.map((province) => (
                    <option
                      key={province}
                      value={province}
                      className="text-black"
                    >
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                شناسه مرکز درمانی
              </label>
              <input
                type="text"
                placeholder="مثال: CTR-110"
                value={staffRegForm.centerId}
                {...register("staff_centerId", {
                  required: "شناسه مرکز درمانی الزامی است",
                  pattern: {
                    value: /^CTR-\d{3}$/,
                    message: "فرمت صحیح: CTR-XXX (مثال: CTR-110)",
                  },
                })}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setStaffRegForm((prev) => ({
                    ...prev,
                    centerId: value,
                  }));
                  setValue("staff_centerId", value, { shouldValidate: true });
                }}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-mono text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
                disabled={isRegistering}
                required
              />
              <p className="mt-1 text-[10px] text-slate-400">
                فرمت: CTR- به‌علاوه‌ی سه رقم (مثال: CTR-110)
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کلمه عبور
            </label>
            <input
              type="password"
              placeholder="رمز قوی شامل حروف و کاراکتر خاص"
              value={
                registerRole === "donor"
                  ? donorRegForm.password
                  : staffRegForm.password
              }
              {...register(
                registerRole === "donor" ? "donor_password" : "staff_password",
                { required: "کلمه عبور الزامی است" },
              )}
              onChange={(e) => {
                const passParams = {
                  length: e.target.value.length >= 8,
                  upperLower:
                    /[a-z]/.test(e.target.value) &&
                    /[A-Z]/.test(e.target.value),
                  number: /[0-9]/.test(e.target.value),
                  special: /[^A-Za-z0-9]/.test(e.target.value),
                };

                if (registerRole === "donor") {
                  setDonorRegForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  setDonorPassStrength(passParams);
                  setValue("donor_password", e.target.value, {
                    shouldValidate: true,
                  });
                } else {
                  setStaffRegForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  setStaffPassStrength(passParams);
                  setValue("staff_password", e.target.value, {
                    shouldValidate: true,
                  });
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              تکرار کلمه عبور
            </label>
            <input
              type="password"
              placeholder="تکرار رمز عبور"
              value={
                registerRole === "donor"
                  ? donorRegForm.confirmPassword
                  : staffRegForm.confirmPassword
              }
              onChange={(e) =>
                registerRole === "donor"
                  ? setDonorRegForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  : setStaffRegForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
              }
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none ${isRegistering ? "cursor-wait" : ""}`}
              disabled={isRegistering}
              required
            />
          </div>

          <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 md:col-span-2">
            <span className="text-xs font-bold text-slate-600">
              شرایط امنیتی رمز عبور:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${(registerRole === "donor" && donorPassStrength.length) || (registerRole === "staff" && staffPassStrength.length) ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حداقل ۸ کاراکتر
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${(registerRole === "donor" && donorPassStrength.upperLower) || (registerRole === "staff" && staffPassStrength.upperLower) ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حمل حروف بزرگ و کوچک (A-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${(registerRole === "donor" && donorPassStrength.number) || (registerRole === "staff" && staffPassStrength.number) ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حداقل یک عدد (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${(registerRole === "donor" && donorPassStrength.special) || (registerRole === "staff" && staffPassStrength.special) ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حداقل یک کاراکتر خاص (@, #, $)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:col-span-2">
            <button
              type="submit"
              disabled={isRegistering}
              className={`flex w-full place-content-center gap-2 rounded-xl py-4 text-sm font-black transition-all ${
                isRegistering
                  ? "cursor-wait bg-rose-100 text-rose-500 shadow-sm"
                  : "cursor-pointer bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:bg-rose-700 active:scale-95"
              }`}
            >
              {!isRegistering &&
                (registerRole === "donor"
                  ? "تکمیل عضویت داوطلب"
                  : "ثبت مرکز و درخواست دسترسی")}
              {isRegistering && (
                <>
                  <span>در حال ثبت نام...</span>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-400">
            ثبت‌نام قبلی داشته‌اید؟
          </span>
          <Link
            to={isRegistering ? "" : "/login"}
            className={`text-xs font-bold text-rose-600 ${isRegistering ? "cursor-wait" : "cursor-pointer hover:underline"}`}
          >
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
