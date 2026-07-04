import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  checkPasswordStrength,
  handleDonorRegister,
} from "../../sharedcomponents/appSlice";
import { useSelector } from "react-redux";

export default function DonorRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { passStrength } = useSelector((store) => store.app);

  const [donorRegForm, setDonorRegForm] = useState({
    name: "",
    nationalId: "",
    mobile: "",
    bloodType: "O+",
    region: "تهران - مرکز",
    password: "",
    confirmPassword: "",
  });

  {
    /* ==========================================
            VIEW: REGISTER - DONOR
            ========================================== */
  }
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col gap-2 text-center">
          <h3 className="text-2xl font-black text-slate-900">
            عضویت داوطلب اهداکننده خون
          </h3>
          <p className="text-xs text-slate-400">
            با پر کردن فرم زیر به شبکه گسترده نجات‌دهندگان بپیوندید.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(handleDonorRegister(donorRegForm, navigate));
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              placeholder="مثال: علی اکبری"
              value={donorRegForm.name}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کد ملی (جهت بررسی سوابق)
            </label>
            <input
              type="text"
              placeholder="۱۰ رقم"
              maxLength={10}
              value={donorRegForm.nationalId}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  nationalId: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
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
              value={donorRegForm.mobile}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  mobile: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              گروه خونی
            </label>
            <select
              value={donorRegForm.bloodType}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  bloodType: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
              required
            >
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              استان / محل سکونت
            </label>
            <input
              type="text"
              placeholder="مثال: تهران - منطقه ۵"
              value={donorRegForm.region}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  region: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کلمه عبور
            </label>
            <input
              type="password"
              placeholder="رمز قوی شامل حروف و کاراکتر خاص"
              value={donorRegForm.password}
              onChange={(e) => {
                setDonorRegForm((prev) => ({
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
              value={donorRegForm.confirmPassword}
              onChange={(e) =>
                setDonorRegForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Strength Validation */}
          <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 md:col-span-2">
            <span className="text-xs font-bold text-slate-600">
              شرایط امنیتی رمز عبور:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${passStrength.length ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حداقل ۸ کاراکتر
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${passStrength.upperLower ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حمل حروف بزرگ و کوچک (A-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${passStrength.number ? "bg-emerald-500" : "bg-slate-300"}`}
                ></span>
                <span className="text-[10px] text-slate-500">
                  حداقل یک عدد (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${passStrength.special ? "bg-emerald-500" : "bg-slate-300"}`}
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
              className="w-full rounded-xl bg-rose-600 py-4 text-sm font-black text-white shadow-md transition-all hover:bg-rose-700 active:scale-95"
            >
              تکمیل عضویت داوطلب
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-400">حساب کاربری دارید؟ </span>
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
