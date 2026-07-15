import { Link, Navigate } from "react-router-dom";
import { showToast } from "../../sharedcomponents/appSlice";
import { useDispatch } from "react-redux";
import { useUserInfo } from "../../sharedcomponents/useUserInfo";
import { useStaffRequests } from "../../sharedcomponents/useStaffRequests";
import { useRegisteredDonorsRequest } from "../../sharedcomponents/useRegisteredDonorsRequest";
import PageLoader from "../../sharedcomponents/PageLoader";
import ProfilesLoader from "../../sharedcomponents/ProfilesLoader";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import api from "../api/axios";

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const { data: userInfo } = useUserInfo();
  const { data: staffNeeds, isLoading } = useStaffRequests();
  const queryClient = useQueryClient();
  const [isResolving, setIsResolving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const isBusy = isConfirming || isResolving;

  async function handleResolveNeed(needId) {
    try {
      setIsResolving(true);
      const payload = {
        pk: needId,
      };
      await api.post(`/blood/requests/${needId}/resolve/`, payload);
      await queryClient.invalidateQueries({
        queryKey: ["fetch_staff_needs"],
      });
      dispatch(
        showToast(
          "نیاز برطرف شد",
          "وضعیت این درخواست به 'تکمیل شده' تغییر یافت و آرشیو شد.",
          "success",
        ),
      );
    } catch (error) {
      const errorMessage = error.message.includes("Network Error")
        ? "خطا در اتصال به اینترنت"
        : "خطا در برطرف کردن نیاز. لطفا دوباره تلاش کنید.";
      dispatch(showToast("خطا در برطرف کردن نیاز", errorMessage, "error"));
      return null;
    } finally {
      setIsResolving(false);
    }
  }

  useEffect(() => {
    try {
      queryClient.invalidateQueries({
        queryKey: ["fetch_staff_needs"],
      });
    } catch {
      return <PageLoader variant={"staff-dashboard"} />;
    }
  }, [queryClient]);

  if (userInfo?.user?.role === "donor") return <Navigate to="/" replace />;
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <span className="text-xs font-extrabold text-rose-600 uppercase">
            پنل هماهنگی بحران بیمارستانی
          </span>
          <h2 className="mt-0.5 text-xl font-black text-slate-900">
            {userInfo?.profile?.first_name
              ? `${userInfo?.profile?.first_name} ${userInfo?.profile?.last_name}`
              : "مرکز درمانی (مهمان)"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            شناسه مرکز: <b>{userInfo?.profile?.medical_center?.center_id}</b> |
            کد ملی: <b>{userInfo?.user?.username || "—"}</b>
          </p>
        </div>

        <Link
          to={isBusy ? "" : "/request/new"}
          className={`flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-rose-600/15 transition-all hover:bg-rose-700 active:scale-95 ${isBusy ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span>افزودن نیاز اورژانسی جدید</span>
          <svg
            className="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-black text-slate-900">
          درخواست‌های فعال ثبت شده توسط مرکز شما
        </h3>

        {isLoading ? (
          <ProfilesLoader />
        ) : staffNeeds?.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">🏥</span>
            <p className="text-xs font-bold text-slate-400">
              هنوز درخواست فعالی توسط مرکز شما ارسال نشده است.
            </p>
            <Link
              to={isBusy ? "" : "/request/new"}
              className={`text-xs font-bold text-rose-600 hover:underline ${isBusy ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              ارسال اولین درخواست اورژانسی
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {staffNeeds?.map((need) => {
              return (
                <div
                  key={need.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-sm font-black text-rose-600">
                        {need.blood_group}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">
                          {need.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          ظرفیت کل: {need.total_capacity} واحد | ظرفیت
                          باقی‌مانده: {need.remaining_capacity} واحد
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {need.status === "active" ? (
                        <>
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            در حال پذیرش
                          </span>
                          <button
                            disabled={isBusy}
                            onClick={() => handleResolveNeed(need.id)}
                            className={`rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100/50 hover:text-emerald-700 ${isBusy ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            علامت برطرف شدن نیاز
                          </button>
                        </>
                      ) : need.status === "resolved" ? (
                        <>
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                            تکمیل شده / آرشیو
                          </span>
                          ,
                        </>
                      ) : (
                        <>
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            در انتظار تایید
                          </span>
                          <button
                            disabled={isBusy}
                            onClick={() => handleResolveNeed(need.id)}
                            className={`rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100/50 hover:text-emerald-700 ${isBusy ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            علامت برطرف شدن نیاز
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <DonorsListPerRequest
                    needId={need.id}
                    isBusy={isBusy}
                    setIsConfirming={setIsConfirming}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DonorsListPerRequest({ needId, isBusy, setIsConfirming }) {
  const dispatch = useDispatch();
  const { data: registeredDonors, isLoading } =
    useRegisteredDonorsRequest(needId);
  const queryClient = useQueryClient();

  async function handleConfirmDonation(resId) {
    try {
      setIsConfirming(true);
      const payload = {
        pk: resId,
      };
      await api.patch(`/blood/donations/${resId}/donated/`, payload);
      await queryClient.invalidateQueries({
        queryKey: ["fetch_registered_donors"],
      });
      dispatch(
        showToast("تایید موفق اهدای خون", `اهداکننده تایید گردید.`, "success"),
      );
    } catch (error) {
      const errorMessage = error.message.includes("Network Error")
        ? "خطا در اتصال به اینترنت"
        : "خطا در تایید اهدا. لطفا دوباره تلاش کنید.";
      dispatch(showToast("خطا در تایید اهدا", errorMessage, "error"));
      return null;
    } finally {
      setIsConfirming(false);
    }
  }

  useEffect(() => {
    try {
      queryClient.invalidateQueries({
        queryKey: ["fetch_registered_donors"],
      });
    } catch {
      return <PageLoader variant={"staff-dashboard"} />;
    }
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-50 pt-4">
      <span className="text-[10px] font-black text-slate-400 uppercase">
        لیست داوطلبان متصل شده به این نیاز:
      </span>
      {isLoading ? (
        <ProfilesLoader />
      ) : registeredDonors?.length === 0 ? (
        <p className="text-[10px] text-slate-400 italic">
          هنوز داوطلبی ثبت‌نام نکرده است.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {registeredDonors?.map((res) => (
            <div
              key={res.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-slate-800">
                  {res.donor.first_name + " " + res.donor.last_name} (
                  {res.donor.blood_group})
                </span>
                <span className="text-[10px] text-slate-400">
                  تلفن: {res.donor.mobile_number}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {res.status === "pending" ? (
                  <button
                    disabled={isBusy}
                    onClick={() => handleConfirmDonation(res.id)}
                    className={`rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-extrabold text-white transition-all hover:bg-emerald-700 ${isBusy ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    تایید اهدای خون بیمار
                  </button>
                ) : (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    ✓ خون داده شده
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
