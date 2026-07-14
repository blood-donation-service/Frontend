import { useDispatch } from "react-redux";
import { useUserInfo } from "../../sharedcomponents/useUserInfo";
import useDonorReservation from "../../sharedcomponents/useDonorReservation";
import api from "../api/axios";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import FilteredNeedsLoader from "../../sharedcomponents/FilteredNeedsLoader";
import { showToast } from "../../sharedcomponents/appSlice";
import PageLoader from "../../sharedcomponents/PageLoader";

export default function DonorProfile() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const { data: reservations, isLoading: reservationsIsLoading } =
    useDonorReservation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancelReservation(resId) {
    setIsLoading(true);
    try {
      const payload = { pk: resId };
      await api.patch(`/blood/donations/${resId}/`, payload);
      dispatch(
        showToast(
          "لغو رزرو",
          "درخواست شما با موفقیت لغو و ظرفیت آزاد شد.",
          "success",
        ),
      );
      queryClient.invalidateQueries({
        queryKey: ["fetch_donor_reserve"],
      });
    } catch (error) {
      const errorMessage = error.message.includes("Network Error")
        ? "خطا در اتصال به اینترنت"
        : "خطا در کنسل کردن رزرو. لطفا دوباره تلاش کنید.";
      dispatch(showToast("خطا در کنسل کردن رزرو", errorMessage, "error"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    try {
      queryClient.invalidateQueries({
        queryKey: ["fetch_donor_reserve"],
      });
    } catch {
      return <PageLoader variant={"donor-profile"} />;
    }
  }, [queryClient]);
  if (reservationsIsLoading) return <PageLoader variant={"donor-profile"} />;

  return (
    <div className="animate-fade-in mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      <h2 className="text-2xl font-black text-slate-900">
        حساب کاربری و سوابق اهدای شما
      </h2>

      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 border-l border-slate-50 pl-6 text-center md:col-span-1">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-3xl font-black text-rose-600 shadow-inner">
            {userInfo?.profile?.blood_group || "O+"}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {userInfo?.profile?.first_name +
                " " +
                userInfo?.profile?.last_name || "کاربر نمونه مهمان"}
            </h3>
            <span className="text-xs text-slate-400">
              داوطلب جامعه داوطلبین
            </span>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-600">
            تأیید هویت موقت
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {[
            {
              label: "کد ملی",
              value: userInfo?.user?.username || "۱۲۳۴۵۶۷۸۹۰",
            },
            {
              label: "شماره موبایل",
              value: userInfo?.profile?.mobile_number || "۰۹۱۲۱۱۱۱۱۱۱",
            },
            {
              label: "استان محل سکونت",
              value: userInfo?.profile?.province || "تهران",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-4"
            >
              <span className="text-[10px] font-bold text-slate-400">
                {item.label}
              </span>
              <span className="text-xs font-extrabold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {reservationsIsLoading ? (
        <FilteredNeedsLoader />
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-black text-slate-900">
            رزروهای ثبت شده شما
          </h3>

          {reservations?.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              هنوز نوبت رزروی ندارید.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {reservations?.map((res) => {
                return (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xs font-bold text-slate-600">
                        🩸
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">
                          {res?.request?.title || "درخواست اورژانسی بیمارستان"}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {res?.request.medical_center?.name || "مرکز نامشخص"} •
                          تاریخ رزرو:{" "}
                          {new Date(
                            res?.request?.created_at,
                          ).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {res?.status === "pending" && (
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                          در انتظار مراجعه
                        </span>
                      )}
                      {res?.status === "donated" && (
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          اهدای موفقیت آمیز شد
                        </span>
                      )}
                      {res?.status === "cancelled" && (
                        <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                          لغو شده
                        </span>
                      )}
                      {res?.status === "expired" && (
                        <span className="rounded-lg bg-fuchsia-50 px-2.5 py-1 text-[10px] font-bold text-fuchsia-950">
                          منقضی شده
                        </span>
                      )}
                      {res?.status === "pending" && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleCancelReservation(res?.id)}
                          className={`rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:cursor-pointer hover:bg-rose-100/50 hover:text-rose-700 ${isLoading ? "cursor-not-allowed" : ""}`}
                        >
                          کنسل کردن
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
