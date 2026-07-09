export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 text-center sm:px-6 md:grid-cols-3 md:text-right lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-lg font-black text-white">سامانه مِدنیاز</span>
          <p className="max-w-sm text-xs leading-relaxed">
            پلتفرم منبع‌باز ملی متصل‌کننده مستقیم اهداکنندگان داوطلب به مراکز
            درمانی در مواقع بحران‌های پزشکی و حوادث غیرمترقبه.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <span className="mb-2 font-bold text-white">
            اصول مهندسی نرم‌افزار پیاده‌سازی شده
          </span>
          <span>✓ کنترل دسترسی مبتنی بر نقش (RBAC)</span>
          <span>✓ پیشگیری تضمینی از Race Condition</span>
          <span>✓ تراکنش‌های اتمیک پایگاه‌داده (Pessimistic Locking)</span>
          <span>✓ مدیریت دوره نقاهت خودکار داوطلبان</span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <span className="mb-2 font-bold text-white">
            ارتباط با توسعه‌دهندگان
          </span>
          <span>دانشگاه علم و صنعت ایران</span>
          <span>درس مهندسی نرم‌افزار - مینی پروژه تحلیل سیستم</span>
          <span>سامانه ثبت شده و مستقل شبکه بهداشت</span>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-800/50 pt-6 text-center text-[10px] text-slate-600">
        کلیه حقوق این سیستم محفوظ و متعلق به دانشگاه علم و صنعت ایران و شبکه ملی
        سلامت داوطلبانه ایران می‌باشد. ۱۴۰۵ ©
      </div>
    </footer>
  );
}
