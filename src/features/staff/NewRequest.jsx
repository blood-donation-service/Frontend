import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { showToast } from "../../sharedcomponents/appSlice";
import { useDispatch } from "react-redux";
import { useUserInfo } from "../../sharedcomponents/useUserInfo";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function NewRequest() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: userInfo } = useUserInfo();

  const [newNeedForm, setNewNeedForm] = useState({
    title: "",
    bloodTypeRequired: "O+",
    quantityRequired: 2,
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const onSubmit = async () => {
    if (isRequesting) return;
    try {
      setIsRequesting(true);

      const payload = {
        title: newNeedForm.title.trim(),
        blood_group: newNeedForm.bloodTypeRequired,
        total_capacity: newNeedForm.quantityRequired,
      };

      await api.post("/blood/requests/create/", payload);

      dispatch(
        showToast(
          "ثبت درخواست جدید اورژانسی",
          "درخواست شما بلافاصله در سامانه و داشبورد اهداکنندگان منتشر شد.",
          "success",
        ),
      );

      navigate("/");
    } catch (error) {
      const errorMessage = error.message.includes("Network Error")
        ? "خطا در اتصال به اینترنت"
        : "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.";
      dispatch(showToast("خطا در ثبت درخواست", errorMessage, "error"));
    } finally {
      setIsRequesting(false);
    }
  };

  if (userInfo?.user?.role === "donor") return <Navigate to="/" replace />;
  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            ثبت نیاز فوری و اورژانسی جدید
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            با ثبت درخواست جدید، اعلان فوری در صفحه تمام اهداکنندگان نمایش داده
            خواهد شد.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              عنوان درخواست (شرح کوتاه وضعیت بیمار)
            </label>
            <input
              type="text"
              placeholder="مثال: نیاز مبرم به خون O+ جهت جراحی تصادف"
              value={newNeedForm.title}
              {...register("title", { required: "نام الزامی است" })}
              onChange={(e) => {
                setNewNeedForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
                setValue("title", e.target.value, {
                  shouldValidate: true,
                });
              }}
              disabled={isRequesting}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none ${isRequesting ? "cursor-wait" : ""}`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                گروه خونی مورد نیاز
              </label>
              <select
                value={newNeedForm.bloodTypeRequired}
                {...register("blood_group", { required: "نام الزامی است" })}
                onChange={(e) => {
                  setNewNeedForm((prev) => ({
                    ...prev,
                    bloodTypeRequired: e.target.value,
                  }));
                  setValue("blood_group", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                disabled={isRequesting}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none ${isRequesting ? "cursor-wait" : "cursor-pointer"}`}
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

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                تعداد ظرفیت مورد نیاز (واحد)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={newNeedForm.quantityRequired}
                {...register("total_capacity", { required: "نام الزامی است" })}
                onChange={(e) => {
                  setNewNeedForm((prev) => ({
                    ...prev,
                    quantityRequired: e.target.value,
                  }));
                  setValue("total_capacity", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                disabled={isRequesting}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none ${isRequesting ? "cursor-wait" : ""}`}
                required
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Link
              type="button"
              to={isRequesting ? "" : "/staff-dashboard"}
              className={`rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 transition-colors ${isRequesting ? "cursor-wait" : "cursor-pointer hover:bg-slate-50"}`}
            >
              انصراف
            </Link>
            <button
              disabled={isRequesting}
              type="submit"
              className={`rounded-xl bg-rose-600 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-rose-600/15 transition-all ${isRequesting ? "cursor-wait" : "cursor-pointer hover:bg-rose-700 active:scale-95"}`}
            >
              {!isRequesting && "تایید و انتشار زنده"}
              {isRequesting && (
                <>
                  <span>در حال ثبت درخواست...</span>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
