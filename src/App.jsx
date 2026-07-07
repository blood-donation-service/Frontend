import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ToastNotifications from "./sharedcomponents/ToastNotifications";
import Navbar from "./sharedcomponents/Navbar";
import Footer from "./sharedcomponents/Footer";
import NotFoundPage from "./sharedcomponents/NotFoundPage";
import PageLoader from "./sharedcomponents/PageLoader";
import RouteProgress from "./sharedcomponents/RouteProgress";

const LandingPage = lazy(() =>
  import("./features/landing/LandingPage").then((m) => ({
    default: m.default,
  })),
);
const Login = lazy(() =>
  import("./features/login/Login").then((m) => ({ default: m.default })),
);
const Register = lazy(() =>
  import("./features/register/Register").then((m) => ({ default: m.default })),
);
const DonorDashboard = lazy(() =>
  import("./features/donor/DonorDashboard").then((m) => ({
    default: m.default,
  })),
);
const StaffDashboard = lazy(() =>
  import("./features/staff/StaffDashboard").then((m) => ({
    default: m.default,
  })),
);
const DonorProfile = lazy(() =>
  import("./features/donor/DonorProfile").then((m) => ({ default: m.default })),
);
const NewRequest = lazy(() =>
  import("./features/staff/NewRequest").then((m) => ({ default: m.default })),
);

const PRE_DEFINED_HOSPITALS = {
  "H-110": {
    name: "بیمارستان امام خمینی",
    address: "تهران، انتهای بلوار کشاورز",
    postalCode: "1419733141",
    phone: "021-61190000",
  },
  "H-120": {
    name: "بیمارستان شریعتی",
    address: "تهران، خیابان کارگر شمالی، تقاطع جلال آل احمد",
    postalCode: "1411713135",
    phone: "021-84901000",
  },
  "H-130": {
    name: "بیمارستان سینا",
    address: "تهران، میدان امام خمینی، خیابان امام خمینی",
    postalCode: "1136746911",
    phone: "021-66701041",
  },
};

function RouteFallback({ variant }) {
  return <PageLoader variant={variant} />;
}

export default function App() {
  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 font-sans leading-relaxed text-slate-800"
      dir="rtl"
    >
      <ToastNotifications />

      {/* DYNAMIC VIEW ROUTER */}
      <BrowserRouter>
        <RouteProgress />
        <Navbar />
        <main className="grow">
          <Routes>
            <Route
              index
              element={
                <Suspense fallback={<RouteFallback variant="landing" />}>
                  <LandingPage />
                </Suspense>
              }
            />
            <Route
              path="login"
              element={
                <Suspense fallback={<RouteFallback variant="login" />}>
                  <Login PRE_DEFINED_HOSPITALS={PRE_DEFINED_HOSPITALS} />
                </Suspense>
              }
            />
            <Route
              path="register"
              element={
                <Suspense fallback={<RouteFallback variant="register" />}>
                  <Register PRE_DEFINED_HOSPITALS={PRE_DEFINED_HOSPITALS} />
                </Suspense>
              }
            />
            <Route
              path="donor-dashboard"
              element={
                <Suspense
                  fallback={<RouteFallback variant="donor-dashboard" />}
                >
                  <DonorDashboard />
                </Suspense>
              }
            />
            <Route
              path="staff-dashboard"
              element={
                <Suspense
                  fallback={<RouteFallback variant="staff-dashboard" />}
                >
                  <StaffDashboard />
                </Suspense>
              }
            />
            <Route
              path="donor-profile"
              element={
                <Suspense fallback={<RouteFallback variant="donor-profile" />}>
                  <DonorProfile />
                </Suspense>
              }
            />
            <Route
              path="request/new"
              element={
                <Suspense fallback={<RouteFallback variant="new-request" />}>
                  <NewRequest />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback variant="notfound" />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}
