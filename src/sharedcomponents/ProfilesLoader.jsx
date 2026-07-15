function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-skeleton-pulse rounded-xl bg-slate-200/70 ${className}`}
    />
  );
}

function NeedCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-50 pt-4">
        <Skeleton className="h-3 w-48" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[0, 1].map((j) => (
            <div
              key={j}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BloodDropIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.5C12 2.5 5 11 5 17a7 7 0 0 0 14 0C19 11 12 2.5 12 2.5z" />
    </svg>
  );
}

export default function ProfilesLoader() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-rose-100 bg-linear-to-b from-rose-50/60 via-white to-white p-10 shadow-sm">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-bob absolute top-8 right-12 h-2 w-2 rounded-full bg-rose-300/70" />
          <div className="animate-float-bob-slow absolute top-20 left-10 h-1.5 w-1.5 rounded-full bg-rose-400/60" />
          <div className="animate-float-bob-delayed absolute right-20 bottom-20 h-2.5 w-2.5 rounded-full bg-rose-200/80" />
          <div className="animate-float-bob absolute bottom-10 left-16 h-1.5 w-1.5 rounded-full bg-rose-300/60" />
        </div>

        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="animate-ring-expand absolute h-28 w-28 rounded-full border-2 border-rose-300/60" />
          <div
            className="animate-ring-expand absolute h-28 w-28 rounded-full border-2 border-rose-400/40"
            style={{ animationDelay: "0.8s" }}
          />
          <div className="animate-drop-pulse relative text-rose-600 drop-shadow-[0_8px_18px_rgba(225,29,72,0.35)]">
            <BloodDropIcon className="h-16 w-16" />
            <div className="absolute top-3 left-1/2 h-3 w-2 -translate-x-2 -rotate-12 rounded-full bg-white/60 blur-[1px]" />
          </div>
        </div>

        <div className="w-full max-w-xs">
          <svg
            viewBox="0 0 240 40"
            className="h-10 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="profiles-ekg-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#fecdd3" />
                <animate
                  attributeName="x1"
                  values="-100%;100%"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values="0%;200%"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,20 L40,20 L48,12 L56,28 L64,8 L72,32 L80,20 L120,20 L128,14 L136,26 L144,6 L152,34 L160,20 L200,20 L208,17 L240,20"
              fill="none"
              stroke="url(#profiles-ekg-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-black text-slate-900">
            در حال بارگذاری درخواست‌ها
          </h4>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400">
            <span>لطفاً چند لحظه صبر کنید</span>
            <span className="flex gap-0.5">
              <span className="animate-dot-bounce h-1 w-1 rounded-full bg-rose-500" />
              <span
                className="animate-dot-bounce h-1 w-1 rounded-full bg-rose-500"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="animate-dot-bounce h-1 w-1 rounded-full bg-rose-500"
                style={{ animationDelay: "0.3s" }}
              />
            </span>
          </p>
        </div>
      </div>

      <NeedCardSkeleton />
      <NeedCardSkeleton />
    </div>
  );
}
