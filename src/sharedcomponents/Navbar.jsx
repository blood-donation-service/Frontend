import { useDispatch } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { setIsReserving, setRegisterRole, showToast } from "./appSlice";
import { useUserInfo } from "./useUserInfo";

const TOKEN_STORAGE_KEY = "access_token";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo();

  function handleLogout() {
    document.cookie = `${TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    queryClient.removeQueries({ queryKey: ["fetch_user_info"] });
    queryClient.cancelQueries({ queryKey: ["fetch_user_info"] });
    queryClient.invalidateQueries({ queryKey: ["fetch_user_info"] });

    queryClient.removeQueries({ queryKey: ["fetch_filtered_needs"] });
    queryClient.removeQueries({ queryKey: ["fetch_needs"] });
    queryClient.removeQueries({ queryKey: ["fetch_registered_donors"] });
    queryClient.removeQueries({ queryKey: ["fetch_staff_requests"] });
    queryClient.removeQueries({ queryKey: ["fetch_donor_profile"] });

    dispatch(setIsReserving(false));

    navigate("/");

    dispatch(
      showToast("خروج از سیستم", "نشست شما با موفقیت خاتمه یافت.", "info"),
    );
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={"/"}
              className="flex cursor-pointer items-center justify-center rounded-2xl bg-rose-600 p-2 text-white shadow-lg shadow-rose-600/20"
            >
              <svg
                className="h-6 w-6 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>
            <Link
              to={"/"}
              className="cursor-pointer text-xl font-black tracking-tight text-slate-900"
            >
              سامانه مِدنیاز
            </Link>
            <span className="hidden rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 md:inline-block">
              تحت شبکه ملی سلامت
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to={"/"}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${pathname === "/" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              صفحه اصلی
            </NavLink>
            {((userInfo?.user?.role && userInfo?.user?.role === "donor") ||
              !userInfo) && (
              <NavLink
                to={"/donor-dashboard"}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${pathname === "/donor-dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                لیست درخواست های اهدای خون
              </NavLink>
            )}
            {userInfo?.user?.role &&
              userInfo?.user?.role === "medical_staff" && (
                <NavLink
                  to={"/staff-dashboard"}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${pathname === "/staff-dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  داشبورد کادر درمان
                </NavLink>
              )}
            {userInfo?.user?.role && userInfo?.user?.role === "donor" && (
              <NavLink
                to={"/donor-profile"}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${pathname === "donor-profile" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                پروفایل من
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isUserInfoLoading ? (
              <div className="flex items-center gap-3">
                <div className="hidden flex-col gap-1.5 lg:flex">
                  <div className="h-3 w-16 animate-pulse rounded-md bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200" />
                </div>
                <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : userInfo?.user?.role ? (
              <div className="flex items-center gap-3">
                <div className="hidden flex-col text-left lg:flex">
                  <span className="text-right text-xs text-slate-400">
                    خوش آمدید،
                  </span>
                  <span className="text-right text-sm font-bold text-slate-700">
                    {userInfo?.profile?.first_name +
                      " " +
                      userInfo?.profile?.last_name}
                  </span>
                </div>
                <button
                  onClick={() => handleLogout()}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600"
                >
                  <span>خروج</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={"/login"}
                  className="px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:cursor-pointer hover:text-slate-900"
                >
                  ورود کاربران
                </Link>
                <Link
                  to={"/register"}
                  onClick={() => dispatch(setRegisterRole("donor"))}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-rose-600/15 transition-all hover:bg-rose-700 active:scale-95"
                >
                  عضویت اهداکنندگان/مراکز درمانی
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
