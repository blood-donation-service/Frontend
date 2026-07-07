import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  setRegisterRole,
  setUserRole,
  showToast,
  specifyUserInfo,
  updateLoginForm,
} from "../../sharedcomponents/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginForm, userRole } = useSelector((store) => store.app);

  const [isLogining, setIsLogining] = useState(false);

  // Authenticate user
  function handleLogin(navigate) {
    if (loginForm.role === "donor") {
      if (loginForm.id.length !== 10) {
        dispatch(showToast("خطا در ورود", "کد ملی باید ۱۰ رقم باشد.", "error"));
        return;
      }
      const mockDonor = {
        id: "donor-1",
        name: "علیرضا رضایی",
        nationalId: loginForm.id,
        bloodType: "O+",
        province: "تهران",
        mobile: "09121111111",
        canDonate: true,
        lockoutUntil: null,
      };
      setIsLogining(true);
      dispatch(specifyUserInfo(mockDonor));
      dispatch(setUserRole("donor"));
      navigate("/donor-dashboard");
      setIsLogining(false);
      dispatch(
        showToast("خوش آمدید", `به عنوان اهداکننده وارد شدید.`, "success"),
      );
    } else {
      const centerId = (loginForm.id || "CTR-110").toUpperCase();
      const mockStaff = {
        id: centerId,
        firstName: "علیرضا",
        lastName: "رضایی",
        nationalCode: "0012345678",
        phone: "61190000",
        centerId: centerId,
      };
      setIsLogining(true);
      dispatch(specifyUserInfo(mockStaff));
      dispatch(setUserRole("staff"));
      navigate("/staff-dashboard");
      setIsLogining(false);
      dispatch(
        showToast(
          "ورود موفقیت‌آمیز مسئول",
          `وارد پنل مدیریت مرکز ${centerId} شدید.`,
          "success",
        ),
      );
    }
  }

  {
    /* ==========================================
            VIEW: AUTHENTICATION (LOGIN)
            ========================================== */
  }
  if (userRole !== null) return <Navigate to="/" replace />;
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
            disabled={isLogining}
            onClick={() =>
              loginForm.role === "staff" &&
              dispatch(updateLoginForm({ ...loginForm, role: "donor" }))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${loginForm.role === "donor" ? "bg-white text-rose-600 shadow" : isLogining ? "cursor-wait text-slate-400" : "cursor-pointer text-slate-400 hover:text-slate-700"}`}
          >
            داوطلب اهداکننده
          </button>
          <button
            disabled={isLogining}
            onClick={() =>
              loginForm.role === "donor" &&
              dispatch(updateLoginForm({ ...loginForm, role: "staff" }))
            }
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${loginForm.role === "staff" ? "bg-white text-rose-600 shadow" : isLogining ? "cursor-wait text-slate-400" : "cursor-pointer text-slate-400 hover:text-slate-700"}`}
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
                onChange={(e) =>
                  e.target.value >= 0 &&
                  dispatch(
                    updateLoginForm({
                      ...loginForm,
                      id: e.target.value,
                    }),
                  )
                }
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none ${isLogining ? "cursor-wait" : ""}`}
                disabled={isLogining}
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
                placeholder="شناسه نمونه: CTR-110 یا CTR-120"
                value={loginForm.id}
                onChange={(e) =>
                  dispatch(
                    updateLoginForm({
                      ...loginForm,
                      id: e.target.value.toUpperCase(),
                    }),
                  )
                }
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none ${isLogining ? "cursor-wait" : ""}`}
                disabled={isLogining}
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
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none ${isLogining ? "cursor-wait" : ""}`}
              disabled={isLogining}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLogining}
            className={`mt-4 flex w-full place-content-center gap-2 rounded-xl py-3.5 text-sm font-black transition-all ${
              isLogining
                ? "cursor-wait bg-rose-100 text-rose-500 shadow-sm"
                : "cursor-pointer bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:bg-rose-700 active:scale-95"
            }`}
          >
            {!isLogining && "ورود به سیستم"}
            {isLogining && (
              <>
                <span>در حال ورود...</span>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-400">حسابی ندارید؟ </span>
          <Link
            to={isLogining ? "" : "/register"}
            onClick={() =>
              !isLogining &&
              (loginForm.role === "donor"
                ? dispatch(setRegisterRole("donor"))
                : dispatch(setRegisterRole("staff")))
            }
            className={`text-xs font-bold text-rose-600 ${isLogining ? "cursor-wait" : "cursor-pointer hover:underline"}`}
          >
            ثبت نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
