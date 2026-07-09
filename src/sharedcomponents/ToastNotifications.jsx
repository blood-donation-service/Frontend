import { useSelector } from "react-redux";

export default function ToastNotifications() {
  const { toasts } = useSelector((store) => store.app);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-50 flex w-full max-w-md flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-slide-in pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl transition-transform duration-300"
        >
          <div
            className={`mt-0.5 rounded-full p-1.5 ${
              t.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : t.type === "error"
                  ? "bg-rose-100 text-rose-600"
                  : t.type === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600"
            }`}
          >
            {t.type === "success" && (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {t.type === "error" && (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {t.type === "warning" && (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {t.type === "info" && (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm leading-tight font-bold text-slate-900">
              {t.title}
            </h4>
            <p className="mt-1 text-xs leading-normal text-slate-500">
              {t.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
