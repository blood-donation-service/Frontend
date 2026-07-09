import { useState } from "react";
import { handleReserve, showToast } from "../../sharedcomponents/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { IRAN_PROVINCES } from "../../sharedcomponents/iranProvinces";

const IRAN_MAP_GRID = [
  ["آذربایجان غربی", "آذربایجان شرقی", "اردبیل", "گیلان", "مازندران", "گلستان"],
  ["کردستان", "زنجان", "قزوین", "البرز", "تهران", "سمنان"],
  ["کرمانشاه", "همدان", "مرکزی", "قم", "اصفهان", "خراسان شمالی"],
  [
    "ایلام",
    "لرستان",
    "چهارمحال و بختیاری",
    "کهگیلویه و بویراحمد",
    "یزد",
    "خراسان رضوی",
  ],
  ["خوزستان", null, "فارس", "بوشهر", "کرمان", "خراسان جنوبی"],
  [null, null, null, "هرمزگان", null, null],
  [null, null, null, "سیستان و بلوچستان", null, null],
];

const MAP_COLS = 6;
const CELL_W = 100;
const CELL_H = 60;
const MAP_W = MAP_COLS * CELL_W;
const MAP_H = IRAN_MAP_GRID.length * CELL_H;

export default function DonorDashboard() {
  const dispatch = useDispatch();
  const { needs, currentUser, isReserving, userRole } = useSelector(
    (store) => store.app,
  );

  const [filterBloodType, setFilterBloodType] = useState("All");
  const [filterProvince, setFilterProvince] = useState("All");
  const [searchHospital, setSearchHospital] = useState("");

  const filteredNeeds = needs.filter((need) => {
    const matchesBlood =
      filterBloodType === "All" || need.bloodTypeRequired === filterBloodType;
    const matchesProvince =
      filterProvince === "All" || need.province === filterProvince;
    const matchesHospital = need.hospitalName
      .toLowerCase()
      .includes(searchHospital.toLowerCase());
    return matchesBlood && matchesProvince && matchesHospital;
  });

  if (userRole === "staff") return <Navigate to="/" replace />;
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {currentUser?.lockoutUntil &&
        new Date(currentUser.lockoutUntil) > new Date() && (
          <div className="animate-fade-in flex flex-col items-start justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-700">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  وضعیت موقت عدم امکان اهدای خون به دلیل اهدای اخیر
                </h4>
                <p className="mt-1 max-w-2xl text-xs text-amber-700">
                  با تشکر از همکاری شایسته شما! به دلیل اینکه شما به تازگی
                  فرآیند اهدای خون را با موفقیت در سیستم تایید کرده‌اید، طبق
                  پروتکل‌های پزشکی برای حفظ تندرستی خود به مدت ۳۰ روز در دوران
                  نقاهت خواهید بود.
                </p>
              </div>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="block rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800">
                {`باقی مانده: ${new Date(currentUser.lockoutUntil) - new Date() > 0 ? Math.ceil(new Date(currentUser.lockoutUntil) - new Date() / (1000 * 60 * 60 * 24)) : 0} روز`}
              </span>
            </div>
          </div>
        )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-lg font-black text-rose-600">
            {currentUser?.bloodType || "مهمان"}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              جستجو در درخواست‌های اورژانسی
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              منطقه جغرافیایی و گروه خونی مطلوب را برای رزرو نوبت انتخاب
              فرمایید.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="border-b border-slate-50 pb-3 text-sm font-black text-slate-950">
              فیلترهای هوشمند جستجو
            </h4>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                جستجوی نام بیمارستان
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: امام خمینی..."
                  value={searchHospital}
                  onChange={(e) => setSearchHospital(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-4 text-xs focus:border-rose-500 focus:outline-none ${isReserving ? "cursor-wait" : ""}`}
                  disabled={isReserving}
                />
                <span className="absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-slate-400">
                  🔍
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                گروه خونی مورد نیاز
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFilterBloodType(type)}
                      disabled={isReserving}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filterBloodType === type ? "bg-rose-600 text-white" : isReserving ? "cursor-wait bg-slate-50 text-slate-600" : "cursor-pointer bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    >
                      {type === "All" ? "همه گروه‌ها" : type}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                استان انتخابی
              </label>
              <select
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                disabled={isReserving}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-rose-500 focus:outline-none ${isReserving ? "cursor-wait" : "cursor-pointer"}`}
              >
                <option value="All">همه استان‌ها</option>
                {IRAN_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-950">
                نقشه تعاملی استان‌های ایران
              </h4>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                زنده / لایو
              </span>
            </div>
            <p className="text-[10px] leading-normal text-slate-400">
              برای فیلتر کردن هوشمند درخواست‌های هر استان، روی بخش‌های نقشه
              شماتیک کلیک کنید:
            </p>

            <div className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="h-auto w-full max-w-sm"
                role="img"
                aria-label="نقشه تعاملی استان‌های ایران"
              >
                {IRAN_MAP_GRID.map((row, rowIdx) =>
                  row.map((name, colIdx) =>
                    name ? (
                      <g
                        key={name}
                        onClick={() =>
                          !isReserving &&
                          setFilterProvince(
                            filterProvince === name ? "All" : name,
                          )
                        }
                        className={`transition-all ${
                          filterProvince === name
                            ? "scale-[1.04] fill-rose-500 stroke-rose-600 opacity-100"
                            : isReserving
                              ? "cursor-wait fill-slate-200 stroke-slate-300"
                              : "cursor-pointer fill-slate-200 stroke-slate-300 hover:fill-slate-300"
                        }`}
                        style={{
                          transformOrigin: `${colIdx * CELL_W + CELL_W / 2}px ${rowIdx * CELL_H + CELL_H / 2}px`,
                        }}
                      >
                        <rect
                          x={colIdx * CELL_W + 2}
                          y={rowIdx * CELL_H + 2}
                          width={CELL_W - 4}
                          height={CELL_H - 4}
                          rx={10}
                          strokeWidth={1.5}
                        />
                        <text
                          x={colIdx * CELL_W + CELL_W / 2}
                          y={rowIdx * CELL_H + CELL_H / 2 + 4}
                          textAnchor="middle"
                          className="pointer-events-none fill-slate-700 text-[10px] font-bold"
                        >
                          {name}
                        </text>
                      </g>
                    ) : null,
                  ),
                )}
              </svg>

              <div className="absolute right-2 bottom-2 left-2 flex justify-between">
                <span className="text-[10px] text-slate-400">
                  استان فعال:{" "}
                  <b>
                    {filterProvince === "All" ? "همه استان‌ها" : filterProvince}
                  </b>
                </span>
                {filterProvince !== "All" && (
                  <button
                    onClick={() => setFilterProvince("All")}
                    disabled={isReserving}
                    className={`text-[10px] font-bold text-rose-600 ${isReserving ? "cursor-wait" : "cursor-pointer hover:underline"}`}
                  >
                    پاک کردن فیلتر
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              یافت شده: <b>{filteredNeeds.length} مورد فعال</b>
            </span>
            <span className="text-xs text-slate-400">
              آخرین بروزرسانی: هم‌اکنون
            </span>
          </div>

          {filteredNeeds.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <span className="text-4xl">🔍</span>
              <h4 className="text-sm font-bold text-slate-900">
                هیچ نیاز فعالی با فیلتر شما همخوانی ندارد.
              </h4>
              <p className="text-xs text-slate-400">
                گروه خونی دیگر یا مناطق اطراف را بررسی بفرمایید.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredNeeds.map((need) => {
                const percentLeft =
                  (need.quantityRemaining / need.quantityRequired) * 100;
                const isCritical =
                  need.quantityRemaining === 1 && need.status === "active";
                const isClosed =
                  need.quantityRemaining === 0 || need.status === "completed";
                const isExpired = need.status === "expired";

                return (
                  <div
                    key={need.id}
                    className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                      isCritical
                        ? "border-rose-400 ring-2 ring-rose-50/50"
                        : isClosed
                          ? "border-slate-100 opacity-75"
                          : isExpired
                            ? "border-amber-200"
                            : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black shadow-inner ${
                            isClosed
                              ? "bg-slate-100 text-slate-400"
                              : isExpired
                                ? "bg-amber-50 text-amber-500"
                                : "bg-rose-500 text-white shadow-rose-500/10"
                          }`}
                        >
                          {need.bloodTypeRequired}
                        </span>
                        <div>
                          <h3 className="text-sm leading-snug font-extrabold text-slate-900 md:text-base">
                            {need.title}
                          </h3>
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                            <span>🏥 {need.hospitalName}</span>
                            <span>•</span>
                            <span>📍 {need.province}</span>
                            <span>•</span>
                            <span>
                              ⏱️{" "}
                              {new Date(need.createdAt).toLocaleTimeString(
                                "fa-IR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isClosed && (
                          <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                            نیاز برطرف شده
                          </span>
                        )}
                        {isExpired && (
                          <span className="rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            منقضی شده (مهلت ۲ روزه)
                          </span>
                        )}
                        {isCritical && (
                          <span className="animate-pulse rounded-lg bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-700">
                            بسیار بحرانی (۱ واحد مانده)
                          </span>
                        )}
                        {!isClosed && !isExpired && !isCritical && (
                          <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                            فعال و معتبر
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-slate-400">
                          آدرس دقیق مراجعه:
                        </span>
                        <p className="leading-relaxed font-medium text-slate-600">
                          {need.address}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 text-xs whitespace-nowrap">
                        <span className="text-slate-400">تلفن هماهنگی:</span>
                        <span className="font-bold text-slate-600">
                          {need.phone}
                        </span>
                      </div>
                    </div>

                    <div className="mb-5 flex flex-col gap-1.5 border-b border-slate-50 pb-4">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400">
                          پیشرفت ظرفیت تأمین شده:
                        </span>
                        <span className="text-slate-700">
                          {need.quantityRequired - need.quantityRemaining} از{" "}
                          {need.quantityRequired} واحد (
                          {Math.round(100 - percentLeft)}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isClosed
                              ? "bg-slate-300"
                              : isCritical
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${100 - percentLeft}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`${!userRole ? "/login" : ""}`}
                      onClick={() => {
                        !userRole
                          ? dispatch(
                              showToast(
                                "توجه",
                                "برای رزرو نوبت اهدای خون ابتدا وارد حساب کاربری خود شوید",
                                "info",
                              ),
                            )
                          : !isReserving &&
                            !isClosed &&
                            !isExpired &&
                            dispatch(handleReserve(need.id));
                      }}
                      className={`mr-auto flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all ${
                        isClosed || isExpired
                          ? "cursor-not-allowed bg-slate-100 text-slate-400 shadow-sm"
                          : isReserving
                            ? "cursor-wait bg-rose-100 text-rose-500 shadow-sm"
                            : "bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:bg-rose-700 active:scale-95"
                      }`}
                    >
                      {isReserving && !isClosed && !isExpired ? (
                        <>
                          <span>در حال رزرو...</span>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
                        </>
                      ) : (
                        <>
                          <span>رزرو ظرفیت اهدای خون</span>
                          <svg
                            className="h-4 w-4"
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
                        </>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
