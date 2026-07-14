function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 animate-skeleton-pulse rounded-2xl bg-slate-200/70" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-4 w-3/4 animate-skeleton-pulse rounded-xl bg-slate-200/70" />
          <div className="h-3 w-1/2 animate-skeleton-pulse rounded-xl bg-slate-200/70" />
        </div>
        <div className="h-5 w-16 animate-skeleton-pulse rounded-lg bg-slate-200/70" />
      </div>
      <div className="h-2 w-full animate-skeleton-pulse rounded-full bg-slate-200/70" />
      <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3">
        <div className="h-3 w-full animate-skeleton-pulse rounded bg-slate-200/70" />
        <div className="h-3 w-2/3 animate-skeleton-pulse rounded bg-slate-200/70" />
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-3 w-32 animate-skeleton-pulse rounded bg-slate-200/70" />
        <div className="h-9 w-36 animate-skeleton-pulse rounded-xl bg-slate-200/70" />
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

export default function FilteredNeedsLoader() {
  return (
    <div className="flex animate-fade-in flex-col gap-6">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-rose-100 bg-linear-to-b from-rose-50/60 via-white to-white p-10 shadow-sm">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-8 right-12 h-2 w-2 animate-float-bob rounded-full bg-rose-300/70" />
          <div className="absolute top-20 left-10 h-1.5 w-1.5 animate-float-bob-slow rounded-full bg-rose-400/60" />
          <div className="absolute bottom-20 right-20 h-2.5 w-2.5 animate-float-bob-delayed rounded-full bg-rose-200/80" />
          <div className="absolute bottom-10 left-16 h-1.5 w-1.5 animate-float-bob rounded-full bg-rose-300/60" />
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
              <linearGradient id="ekg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
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
              stroke="url(#ekg-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-black text-slate-900">
            در حال جستجو در درخواست‌ها
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

      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
