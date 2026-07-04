import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  checkPasswordStrength,
  handleHospitalIdChange,
  handlePostalCodeChange,
  handleStaffRegister,
} from "../../sharedcomponents/appSlice";

export default function StaffRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [staffRegForm, setStaffRegForm] = useState({
    hospitalId: "",
    hospitalName: "",
    address: "",
    postalCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  {
    /* ==========================================
            VIEW: REGISTER - STAFF
            ========================================== */
  }
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col gap-2 text-center">
          <h3 className="text-2xl font-black text-slate-900">
            ثبت مرکز درمانی و بیمارستان
          </h3>
          <p className="text-xs text-slate-400">
            اطلاعات حقوقی بیمارستان خود را جهت اخذ دسترسی مدیریت بحران تکمیل
            کنید.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(handleStaffRegister(staffRegForm, navigate));
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              شناسه رسمی مرکز درمانی
            </label>
            <input
              type="text"
              placeholder="مثال: H-110"
              value={staffRegForm.hospitalId}
              onChange={(e) =>
                dispatch(
                  handleHospitalIdChange(
                    e.target.value.toUpperCase(),
                    setStaffRegForm,
                  ),
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-mono text-sm focus:border-rose-500 focus:outline-none"
              required
            />
            <p className="mt-1 text-[10px] text-rose-500">
              تایپ کنید: H-110, H-120 یا H-130 برای پر کردن خودکار
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              نام رسمی بیمارستان / مرکز
            </label>
            <input
              type="text"
              placeholder="مثال: بیمارستان شریعتی"
              value={staffRegForm.hospitalName}
              onChange={(e) =>
                setStaffRegForm((prev) => ({
                  ...prev,
                  hospitalName: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کد پستی ۱۰ رقمی
            </label>
            <input
              type="text"
              placeholder="مثال: 1419733141"
              maxLength={10}
              value={staffRegForm.postalCode}
              onChange={(e) =>
                dispatch(
                  handlePostalCodeChange(e.target.value, setStaffRegForm),
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-mono text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              شماره تلفن مستقیم بخش خون/اورژانس
            </label>
            <input
              type="text"
              placeholder="مثال: 021-61190000"
              value={staffRegForm.phone}
              onChange={(e) =>
                setStaffRegForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              آدرس دقیق جغرافیایی
            </label>
            <textarea
              placeholder="تهران، بزرگراه..."
              value={staffRegForm.address}
              onChange={(e) =>
                setStaffRegForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              className="h-20 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کلمه عبور مدیریت
            </label>
            <input
              type="password"
              placeholder="حداقل ۸ کاراکتر"
              value={staffRegForm.password}
              onChange={(e) => {
                setStaffRegForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                dispatch(checkPasswordStrength(e.target.value));
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
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
              value={staffRegForm.confirmPassword}
              onChange={(e) =>
                setStaffRegForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="mt-4 md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-rose-600 py-4 text-sm font-black text-white shadow-md transition-all hover:bg-rose-700 active:scale-95"
            >
              ثبت مرکز و درخواست دسترسی
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-400">
            ثبت‌نام قبلی داشته‌اید؟
          </span>
          <Link
            to={"/login"}
            className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
          >
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}
