function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-skeleton-pulse rounded-xl bg-slate-200/70 ${className}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>
    </div>
  );
}

function StatSkeleton({ color = "bg-rose-200/70" }) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className={`h-10 w-10 ${color} rounded-2xl`} />
      <Skeleton className="mt-2 h-3 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

function ProcessSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <Skeleton className="h-8 w-12 rounded-br-3xl" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

function FilterPanelSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-1/3" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-12 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-44 w-full rounded-2xl" />
    </div>
  );
}

function FormFieldSkeleton({ withLabel = true, height = "h-12" }) {
  return (
    <div className="flex flex-col gap-1.5">
      {withLabel && <Skeleton className="h-3 w-24" />}
      <Skeleton className={`${height} w-full rounded-xl`} />
    </div>
  );
}

function TabsSkeleton() {
  return <Skeleton className="mb-6 h-11 w-full rounded-2xl" />;
}

function ButtonSkeleton({ width = "w-full" }) {
  return <Skeleton className={`h-12 ${width} rounded-xl`} />;
}

function BannerSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="hidden h-3 w-64 lg:block" />
      </div>
      <Skeleton className="h-8 w-32 rounded-xl" />
    </div>
  );
}

function HeaderCardSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
      <Skeleton className="h-11 w-44 rounded-2xl" />
    </div>
  );
}

export function LandingSkeleton() {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-16 px-4 py-12 md:py-20">
      <BannerSkeleton />

      <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
        <Skeleton className="h-12 w-11/12 max-w-3xl" />
        <Skeleton className="h-12 w-9/12 max-w-2xl" />
        <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Skeleton className="h-14 w-56 rounded-2xl" />
          <Skeleton className="h-14 w-56 rounded-2xl" />
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-72" />
            <Skeleton className="h-3 w-96" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-8">
        <Skeleton className="mx-auto h-7 w-80" />
        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProcessSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        <StatSkeleton color="bg-indigo-200/70" />
        <StatSkeleton color="bg-emerald-200/70" />
        <StatSkeleton color="bg-rose-200/70" />
        <StatSkeleton color="bg-amber-200/70" />
      </div>
    </div>
  );
}

export function DonorDashboardSkeleton() {
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-3 w-96 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-48 rounded-xl" />
      </div>

      <HeaderCardSkeleton />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <FilterPanelSkeleton />
          <MapSkeleton />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StaffDashboardSkeleton() {
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-3 w-md max-w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-56 rounded-xl" />
      </div>

      <HeaderCardSkeleton />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="mb-5 h-5 w-72" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-5"
            >
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
                  {Array.from({ length: 2 }).map((_, j) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}

export function DonorProfileSkeleton() {
  return (
    <div className="animate-fade-in mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      <Skeleton className="h-7 w-72" />

      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-3">
        <div className="flex flex-col items-center gap-3 border-l border-slate-50 pl-6 text-center md:col-span-1">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4"
            >
              <Skeleton className="h-2.5 w-1/2" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="mb-5 h-5 w-48" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-56" />
                  <Skeleton className="h-2.5 w-40" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton({ withTabs = false, fieldRows = 1 }) {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="animate-fade-in flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        {withTabs && <TabsSkeleton />}
        <div className="flex flex-col gap-4">
          {Array.from({ length: fieldRows }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormFieldSkeleton />
              <FormFieldSkeleton />
            </div>
          ))}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <ButtonSkeleton />
        </div>
        <Skeleton className="mx-auto h-3 w-48" />
      </div>
    </div>
  );
}

export function LoginSkeleton() {
  return <FormSkeleton withTabs fieldRows={1} />;
}

export function RegisterSkeleton() {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="animate-fade-in flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-72" />
        </div>
        <TabsSkeleton />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="md:col-span-2">
            <FormFieldSkeleton height="h-20" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4">
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              ))}
            </div>
          </div>
          <ButtonSkeleton />
        </div>
        <Skeleton className="mx-auto h-3 w-56" />
      </div>
    </div>
  );
}

export function NewRequestSkeleton() {
  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <FormFieldSkeleton />
          <div className="grid grid-cols-2 gap-4">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-44 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotFoundSkeleton() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <Skeleton className="h-28 w-28 rounded-3xl" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-16 w-40" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-3 w-80 max-w-full" />
      </div>
      <Skeleton className="h-12 w-48 rounded-xl" />
    </div>
  );
}

const VARIANTS = {
  landing: LandingSkeleton,
  "donor-dashboard": DonorDashboardSkeleton,
  "staff-dashboard": StaffDashboardSkeleton,
  "donor-profile": DonorProfileSkeleton,
  login: LoginSkeleton,
  register: RegisterSkeleton,
  form: FormSkeleton,
  "new-request": NewRequestSkeleton,
  notfound: NotFoundSkeleton,
};

export default function PageLoader({ variant = "landing" }) {
  const SkeletonComponent = VARIANTS[variant] || LandingSkeleton;
  return <SkeletonComponent />;
}
