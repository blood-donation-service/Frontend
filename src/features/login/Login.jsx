import { Link, Navigate, useNavigate } from "react-router-dom";
import { setRegisterRole, showToast } from "../../sharedcomponents/appSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useUserInfo } from "../../sharedcomponents/useUserInfo";
import { useQueryClient } from "react-query";

const setAuthCookie = (token) => {
  document.cookie = `access_token=${token}; path=/;  SameSite=Lax`;
};

export default function Login() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();

  const [LogForm, setLogForm] = useState({
    id: "",
    password: "",
  });
  const [isLogining, setIsLogining] = useState(false);

  const onSubmit = async () => {
    if (isLogining) return;
    setIsLogining(true);
    try {
      if (!handleFrontErrors()) return;

      const payload = {
        identifier: LogForm.id.trim(),
        password: LogForm.password,
      };

      const response = await api.post("/api/auth/login/", payload);
      if (response.data.access) {
        await setAuthCookie(response.data.access);
      }
      await queryClient.invalidateQueries(["fetch_user_info"]);
      if (response.data.user.role === "donor") {
        navigate("/donor-dashboard");
        dispatch(
          showToast("خوش آمدید", `به عنوان اهداکننده وارد شدید.`, "success"),
        );
      } else {
        navigate("/staff-dashboard");
        dispatch(
          showToast(
            "ورود موفقیت‌آمیز پرسنل",
            `وارد پنل مدیریتی کادر درمان شدید.`,
            "success",
          ),
        );
      }
    } catch (error) {
      const errorMessage = error.message.includes("Network Error")
        ? "خطا در اتصال به اینترنت"
        : error.message.includes("400")
          ? "کد ملی یا کلمه عبور اشتباه است"
          : "خطا در ورود. لطفاً دوباره تلاش کنید.";
      dispatch(showToast("خطا در ورود", errorMessage, "error"));
    }
  };

  function handleFrontErrors() {
    if (LogForm.id.length !== 10) {
      dispatch(showToast("خطا در ورود", "کد ملی باید ۱۰ رقم باشد.", "error"));
      return false;
    }
    return true;
  }

  if (userInfo?.user?.role && !isLogining) return <Navigate to="/" replace />;
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              کد ملی (۱۰ رقم)
            </label>
            <input
              type="text"
              placeholder="نمونه: 1234567890"
              value={LogForm.id}
              maxLength={10}
              {...register("nationalId", { required: "کد ملی الزامی است" })}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setLogForm((prev) => ({
                    ...prev,
                    id: e.target.value.trim(),
                  }));
                  setValue("nationalId", e.target.value.trim(), {
                    shouldValidate: true,
                  });
                }
              }}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-all focus:border-rose-500 focus:bg-white focus:outline-none ${isLogining ? "cursor-wait" : ""}`}
              disabled={isLogining}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">رمز عبور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={LogForm.password}
              {...register("password", { required: "کلمه عبور الزامی است" })}
              onChange={(e) => {
                setLogForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                setValue("password", e.target.value, {
                  shouldValidate: true,
                });
              }}
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
            onClick={() => !isLogining && dispatch(setRegisterRole("donor"))}
            className={`text-xs font-bold text-rose-600 ${isLogining ? "cursor-wait" : "cursor-pointer hover:underline"}`}
          >
            ثبت نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
