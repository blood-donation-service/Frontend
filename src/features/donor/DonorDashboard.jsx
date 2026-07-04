import { useState } from "react";
import {
  clearConcurLog,
  handleReserve,
  quickLoginAsDonor,
  setRaceConditionMode,
  triggerTimeLapse,
} from "../../sharedcomponents/appSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DonorDashboard() {
  const dispatch = useDispatch();
  const {
    needs,
    currentUser,
    raceConditionMode,
    concurrencyLog,
    simulatingLock,
  } = useSelector((store) => store.app);

  // Filter States for Donor Dashboard & Main Page List
  const [filterBloodType, setFilterBloodType] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All");
  const [searchHospital, setSearchHospital] = useState("");

  // Filters calculation
  const filteredNeeds = needs.filter((need) => {
    const matchesBlood =
      filterBloodType === "All" || need.bloodTypeRequired === filterBloodType;
    const matchesRegion =
      filterRegion === "All" || need.region.includes(filterRegion);
    const matchesHospital = need.hospitalName
      .toLowerCase()
      .includes(searchHospital.toLowerCase());
    return matchesBlood && matchesRegion && matchesHospital;
  });

  {
    /* ==========================================
            VIEW: DONOR DASHBOARD (CORE INTERACTION)
            ========================================== */
  }
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Guest / Demo Mode Header Warning */}
      {!currentUser && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-6 shadow-sm md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900">
                حالت مشاهده مهمان (بدون نیاز به ورود) فعال است
              </h4>
              <p className="mt-1 max-w-2xl text-xs text-blue-700">
                شما بدون وارد شدن به حساب کاربری می‌توانید کل سیستم را کاوش،
                فیلتر و حتی رزرو کنید. برای شبیه‌سازی دقیق‌تر با هویت یک
                اهداکننده واقعی، می‌توانید از دکمه ورود سریع اهداکننده استفاده
                کنید.
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(quickLoginAsDonor())}
            className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700"
          >
            ⚡ ورود سریع اهداکننده نمونه
          </button>
        </div>
      )}

      {/* Lockout & Recovery Warnings */}
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
                  وضعیت موقت عدم صلاحیت به دلیل اهدای اخیر
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
                باقی مانده: ۳۰ روز
              </span>
            </div>
          </div>
        )}

      {/* Dash Header */}
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

        {/* Time lapse simulator button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(triggerTimeLapse())}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-800"
            title="شبیه‌سازی گذر زمان ۲ روزه جهت بررسی درخواست‌های منقضی"
          >
            <span>⏱️ شبیه‌سازی گذر زمان (۲ روز)</span>
          </button>
        </div>
      </div>

      {/* CORE COLUMNS: MAP, FILTERS & CARDS */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* Filter Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Search & Selection */}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-4 text-xs focus:border-rose-500 focus:outline-none"
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filterBloodType === type ? "bg-rose-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    >
                      {type === "All" ? "همه گروه‌ها" : type}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                منطقه انتخابی
              </label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="All">همه مناطق</option>
                <option value="مرکز">تهران - مرکز</option>
                <option value="شمال">تهران - شمال</option>
                <option value="جنوب">تهران - جنوب</option>
              </select>
            </div>
          </div>

          {/* GRAPHICAL INTERACTIVE REGIONAL MAP */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-950">
                نقشه تعاملی مناطق اورژانس
              </h4>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                زنده / لایو
              </span>
            </div>
            <p className="text-[10px] leading-normal text-slate-400">
              برای فیلتر کردن هوشمند درخواست‌های هر منطقه، روی بخش‌های نقشه
              شماتیک کلیک کنید:
            </p>

            {/* Simulated SVG Map of Regions */}
            <div className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <svg viewBox="0 0 300 240" className="h-auto w-full max-w-60">
                {/* Central Grid Region */}
                <g
                  onClick={() =>
                    setFilterRegion(filterRegion === "مرکز" ? "All" : "مرکز")
                  }
                  className={`cursor-pointer transition-all ${filterRegion === "مرکز" ? "scale-105 fill-rose-500 stroke-rose-600 opacity-100" : "fill-slate-200 stroke-slate-300 hover:fill-slate-300"}`}
                >
                  <rect x="100" y="80" width="100" height="80" rx="15" />
                  <text
                    x="150"
                    y="125"
                    textAnchor="middle"
                    className="pointer-events-none fill-slate-700 text-[11px] font-bold"
                  >
                    منطقه مرکز
                  </text>
                </g>

                {/* Northern Grid Region */}
                <g
                  onClick={() =>
                    setFilterRegion(filterRegion === "شمال" ? "All" : "شمال")
                  }
                  className={`cursor-pointer transition-all ${filterRegion === "شمال" ? "scale-105 fill-rose-500 stroke-rose-600 opacity-100" : "fill-slate-200 stroke-slate-300 hover:fill-slate-300"}`}
                >
                  <path d="M70,15 L230,15 L200,65 L100,65 Z" />
                  <text
                    x="150"
                    y="45"
                    textAnchor="middle"
                    className="pointer-events-none fill-slate-700 text-[11px] font-bold"
                  >
                    منطقه شمال
                  </text>
                </g>

                {/* Southern Grid Region */}
                <g
                  onClick={() =>
                    setFilterRegion(filterRegion === "جنوب" ? "All" : "جنوب")
                  }
                  className={`cursor-pointer transition-all ${filterRegion === "جنوب" ? "scale-105 fill-rose-500 stroke-rose-600 opacity-100" : "fill-slate-200 stroke-slate-300 hover:fill-slate-300"}`}
                >
                  <path d="M100,175 L200,175 L230,225 L70,225 Z" />
                  <text
                    x="150"
                    y="205"
                    textAnchor="middle"
                    className="pointer-events-none fill-slate-700 text-[11px] font-bold"
                  >
                    منطقه جنوب
                  </text>
                </g>
              </svg>

              <div className="absolute right-2 bottom-2 left-2 flex justify-between">
                <span className="text-[10px] text-slate-400">
                  منطقه فعال:{" "}
                  <b>{filterRegion === "All" ? "همه مناطق" : filterRegion}</b>
                </span>
                {filterRegion !== "All" && (
                  <button
                    onClick={() => setFilterRegion("All")}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    پاک کردن فیلتر
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CONCURRENCY SIMULATOR SETTINGS CONTROL */}
          <div className="flex flex-col gap-4 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <h4 className="text-sm font-black text-rose-900">
                تست شبیه‌سازی همزمانی (Race Condition)
              </h4>
            </div>
            <p className="text-[11px] leading-normal text-slate-500">
              برای بررسی نحوه کارکرد بک‌اند پروژه در جلوگیری از{" "}
              <b>کاهش منفی ظرفیت</b>، یکی از مکانیزم‌های زیر را برای شبیه‌سازی
              درخواست همزمان کلیک رزرو انتخاب کنید:
            </p>

            <div className="flex flex-col gap-2">
              {[
                {
                  key: "none",
                  title: "شبیه‌سازی ریسک (بدون قفل دیتابیس)",
                  desc: "ممکن است به دلیل تداخل همزمان، ظرفیت زیر صفر برود یا رزرو نامعتبر ثبت گردد.",
                },
                {
                  key: "pessimistic",
                  title: "Pessimistic Locking (قفل بدبینانه)",
                  desc: "تراکنش ایمن اتمیک. رکورد دیتابیس تا پایان تراکنش قفل انحصاری می‌شود.",
                },
                {
                  key: "optimistic",
                  title: "Optimistic Locking (قفل خوش‌بینانه)",
                  desc: "تراکنش بر اساس تطابق نسخه کنترل می‌شود و در صورت تداخل لغو (Rollback) می‌گردد.",
                },
              ].map((mode) => (
                <label
                  key={mode.key}
                  className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-transparent bg-slate-50 p-3 hover:border-slate-200/50 hover:bg-slate-100/50"
                >
                  <input
                    type="radio"
                    name="concurrency"
                    checked={raceConditionMode === mode.key}
                    onChange={() => dispatch(setRaceConditionMode(mode.key))}
                    className="mt-1 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-slate-800">
                      {mode.title}
                    </span>
                    <span className="text-[10px] leading-normal text-slate-400">
                      {mode.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Terminal Logger */}
            {concurrencyLog.length > 0 && (
              <div className="animate-fade-in flex max-h-45 flex-col gap-1 overflow-y-auto rounded-2xl bg-slate-900 p-4 font-mono text-[10px] text-slate-100 shadow-inner">
                <div className="mb-1.5 flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400">
                  <span>لاگ زنده تراکنش پایگاه داده:</span>
                  <button
                    onClick={() => dispatch(clearConcurLog())}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    پاک کردن
                  </button>
                </div>
                {concurrencyLog.map((log, index) => (
                  <div
                    key={index}
                    className={
                      log.includes("[خطا]")
                        ? "text-rose-400"
                        : log.includes("[تراکنش]")
                          ? "text-cyan-400"
                          : "text-slate-300"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Need Cards List Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Search result count */}
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
                    {/* Top row */}
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
                            <span>📍 {need.region}</span>
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

                      {/* Status badges */}
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

                    {/* Detail body */}
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

                    {/* Progress bar */}
                    <div className="mb-5 flex flex-col gap-1.5">
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

                    {/* Action panel */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span>🛡️ تراکنش امن اتمیک: </span>
                        <span className="font-extrabold text-slate-500">
                          {raceConditionMode === "none" && "غیر فعال"}
                          {raceConditionMode === "pessimistic" &&
                            "Pessimistic-Lock active"}
                          {raceConditionMode === "optimistic" &&
                            "Optimistic-v mismatch active"}
                        </span>
                      </div>

                      <button
                        onClick={() => dispatch(handleReserve(need.id))}
                        disabled={
                          isClosed ||
                          isExpired ||
                          simulatingLock ||
                          (currentUser?.lockoutUntil &&
                            new Date(currentUser.lockoutUntil) > new Date())
                        }
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all ${
                          isClosed || isExpired
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : simulatingLock
                              ? "cursor-wait bg-rose-100 text-rose-500"
                              : "bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:bg-rose-700 active:scale-95"
                        }`}
                      >
                        {simulatingLock ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
                            <span>در حال قفل ایمن دیتابیس...</span>
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
                      </button>
                    </div>
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
