import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleReserve } from "../../sharedcomponents/appSlice";

export default function LandingPage() {
  const dispatch = useDispatch();
  const { needs } = useSelector((store) => store.app);
  {
    /* ==========================================
            VIEW: LANDING PAGE
            ========================================== */
  }
  return (
    <div className="flex flex-col items-center gap-16 px-4 py-12 md:py-20">
      {/* Urgent Notification Banner */}
      <div className="animate-fade-in flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
          </span>
          <span className="text-sm font-extrabold text-slate-800">
            اعلان اضطراری زمان واقعی:
          </span>
          <span className="hidden text-xs text-slate-500 lg:inline">
            نیاز شدید به خون گروه A- در بیمارستان شریعتی تهران. با اهدای فوری
            نجات‌دهنده باشید!
          </span>
        </div>
        <Link
          to={"/donor-dashboard"}
          className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-extrabold text-white transition-colors hover:bg-rose-700"
        >
          مشاهده و رزرو اهدا
        </Link>
      </div>

      {/* HERO SECTION */}
      <div className="flex max-w-5xl flex-col items-center gap-6 text-center">
        <h1 className="max-w-4xl text-4xl leading-tight font-black tracking-tight text-slate-900 md:text-6xl">
          اتصال مستقیم <span className="text-rose-600">اهداکنندگان خون</span> به
          مراکز درمانی در شرایط بحرانی
        </h1>
        <p className="max-w-2xl text-base text-slate-500 md:text-lg">
          مِدنیاز، سامانه‌ای هوشمند، ایمن و مستقل از سرویس‌های واسط خارجی است که
          در مواقع اضطراری فرآیند درخواست تا رزرو خون و پلاسما را بدون تاخیر
          هدایت می‌کند.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={"/donor-dashboard"}
            className="rounded-2xl bg-rose-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95"
          >
            ورود مستقیم به بخش رزرو اهدا (بدون نیاز به لاگین)
          </Link>
          <Link
            to={"/staff-dashboard"}
            className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-extrabold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            ورود مستقیم به پنل کادر درمان
          </Link>
        </div>
      </div>

      {/* ==========================================
                LANDING VIEW INTEGRATION: LIVE REQUESTS LIST
                ========================================== */}
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
              <span className="text-rose-600">🩸</span> لیست زنده‌ی درخواست‌های
              اضطراری مراکز درمانی
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              بدون نیاز به ورود به راحتی می‌توانید از همینجا نوبت رزرو کنید یا
              اطلاعات دقیق مراجعه را ببینید.
            </p>
          </div>
          <Link
            to={"/donor-dashboard"}
            className="flex items-center gap-1 text-xs font-extrabold text-rose-600 hover:text-rose-700"
          >
            <span>نمایش همه در نقشه تعاملی</span>
            <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {needs
            .filter((n) => n.status === "active")
            .slice(0, 4)
            .map((need) => {
              const percentLeft =
                (need.quantityRemaining / need.quantityRequired) * 100;
              const isCritical = need.quantityRemaining === 1;

              return (
                <div
                  key={need.id}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                    isCritical
                      ? "border-rose-400 ring-2 ring-rose-50/50"
                      : "border-slate-150"
                  }`}
                >
                  <div>
                    {/* Header card info */}
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-lg font-black text-rose-600 shadow-inner">
                        {need.bloodTypeRequired}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm leading-snug font-extrabold text-slate-900">
                          {need.title}
                        </h4>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                          <span>🏥 {need.hospitalName}</span>
                          <span>•</span>
                          <span>📍 {need.region}</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="my-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isCritical ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${100 - percentLeft}%` }}
                      ></div>
                    </div>

                    {/* Detail text */}
                    <div className="my-3 flex flex-col gap-1 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-500">
                      <span>
                        📍 <b>آدرس:</b> {need.address}
                      </span>
                      <span>
                        📞 <b>تلفن تماس:</b> {need.phone}
                      </span>
                    </div>
                  </div>

                  {/* Reserve action panel */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400">
                      {need.quantityRemaining} واحد مورد نیاز باقی‌مانده
                    </span>
                    <button
                      onClick={() => {
                        // If guest, auto perform reservation as a guest seamlessly
                        console.log(need.id);
                        dispatch(handleReserve(need.id));
                      }}
                      className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95"
                    >
                      رزرو سریع نوبت اهدا
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* PROCESS CARDS */}
      <div className="flex w-full max-w-5xl flex-col gap-8">
        <h3 className="text-center text-2xl font-black text-slate-900">
          چگونه جان یک بیمار را نجات می‌دهید؟
        </h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "۰۱",
              title: "ثبت و انتشار نیاز فوری",
              desc: "مراکز درمانی با درج مشخصات دقیق، گروه خونی مورد نیاز و تعداد مورد تقاضا را سریعاً در سامانه ثبت می‌کنند.",
            },
            {
              step: "۰۲",
              title: "رزرو ایمن نوبت اهدا",
              desc: "اهداکنندگان گروه خونی منطبق، با استفاده از سیستم همزمانی اتمیک سامانه، یک ظرفیت را به صورت ایمن رزرو می‌کنند.",
            },
            {
              step: "۰۳",
              title: "مراجعه مستقیم و اهدای حیات",
              desc: "اهداکننده با دریافت آدرس دقیق و شماره تلفن مستقیماً به مرکز درمانی مراجعه کرده و کادر درمان سلامت اهدا را تایید می‌کند.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-rose-100"
            >
              <div className="absolute top-0 left-0 rounded-br-3xl bg-rose-500/10 p-6 text-4xl font-black text-rose-600 transition-transform group-hover:scale-110">
                {p.step}
              </div>
              <h4 className="mt-6 text-lg font-bold text-slate-900">
                {p.title}
              </h4>
              <p className="text-sm leading-relaxed text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE STATISTICS */}
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {[
          {
            label: "بیمارستان‌های فعال",
            value: "۱۲ مرکز",
            icon: "hospital",
            bg: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "داوطلبین اهداکننده",
            value: "۱,۴۸۰ نفر",
            icon: "users",
            bg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "نیازهای فعال اورژانسی",
            value: "۴ درخواست",
            icon: "heart",
            bg: "bg-rose-50 text-rose-600",
          },
          {
            label: "اهدای موفق (سیستم اتمیک)",
            value: "۸۴۹ مورد",
            icon: "shield",
            bg: "bg-amber-50 text-amber-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div
              className={`h-10 w-10 ${stat.bg} mb-2 flex items-center justify-center rounded-2xl font-bold`}
            >
              {stat.icon === "hospital" && "🏥"}
              {stat.icon === "users" && "👥"}
              {stat.icon === "heart" && "❤️"}
              {stat.icon === "shield" && "🛡️"}
            </div>
            <span className="text-xs font-medium text-slate-400">
              {stat.label}
            </span>
            <span className="text-xl font-black text-slate-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
