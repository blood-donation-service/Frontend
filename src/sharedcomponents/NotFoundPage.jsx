import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="flex items-center justify-center rounded-3xl bg-rose-50 p-6">
        <svg
          className="h-20 w-20 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-7xl font-black tracking-tight text-slate-200">
          ۴۰۴
        </h1>
        <h2 className="text-2xl font-black text-slate-800">
          صفحه مورد نظر یافت نشد
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-slate-500">
          صفحه‌ای که به دنبال آن هستید وجود ندارد، حذف شده یا آدرس آن اشتباه
          وارد شده است.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-rose-600/15 transition-all hover:bg-rose-700 active:scale-95"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>بازگشت به صفحه اصلی</span>
      </Link>
    </div>
  );
}
