import { Link, useNavigate } from "react-router-dom";
import { handleLogin, updateLoginForm } from "../../sharedcomponents/appSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginForm } = useSelector((store) => store.app);

  {
    /* ==========================================
            VIEW: AUTHENTICATION (LOGIN)
            ========================================== */
  }
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h3 className="text-2xl font-black text-slate-900">
            ورود امن به سیستم
          </h3>
          <p className="text-xs text-slate-400">
            نقش خود را انتخاب کرده و اطلاعات کاربری‌تان را درج کنید.
          </p>
        </div>

        {/* Role Picker Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-50 p-1">
          <button
            onClick={() =>
              dispatch(updateLoginForm({ ...loginForm, role: "donor" }))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${loginForm.role === "donor" ? "bg-white text-rose-600 shadow" : "text-slate-400 hover:text-slate-700"}`}
          >
            داوطلب اهداکننده
          </button>
          <button
            onClick={() =>
              dispatch(updateLoginForm({ ...loginForm, role: "staff" }))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${loginForm.role === "staff" ? "bg-white text-rose-600 shadow" : "text-slate-400 hover:text-slate-700"}`}
          >
            کادر درمان / بیمارستان
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(handleLogin(navigate));
          }}
          className="flex flex-col gap-4"
        >
          {loginForm.role === "donor" ? (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                کد ملی اهداکننده (۱۰ رقم)
              </label>
              <input
                type="text"
                placeholder="نمونه: 1234567890"
                value={loginForm.id}
                maxLength={10}
                onChange={(e) => {
                  dispatch(
                    updateLoginForm({
                      ...loginForm,
                      id: e.target.value,
                    }),
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                شناسه مرکز درمانی
              </label>
              <input
                type="text"
                placeholder="شناسه های نمونه: H-110 یا H-120"
                value={loginForm.id}
                onChange={(e) =>
                  dispatch(
                    updateLoginForm({
                      ...loginForm,
                      id: e.target.value.toUpperCase(),
                    }),
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-600">رمز عبور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) =>
                dispatch(
                  updateLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  }),
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-rose-600 py-3.5 text-sm font-black text-white shadow-md transition-all hover:bg-rose-700 active:scale-95"
          >
            ورود به سیستم
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-400">حسابی ندارید؟ </span>
          <Link
            to={`${loginForm.role === "donor" ? "/donor-reg" : "/staff-reg"}`}
            className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
          >
            ثبت نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
