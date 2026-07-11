import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ToastNotifications from "./sharedcomponents/ToastNotifications";
import Navbar from "./sharedcomponents/Navbar";
import Footer from "./sharedcomponents/Footer";
import NotFoundPage from "./sharedcomponents/NotFoundPage";
import PageLoader from "./sharedcomponents/PageLoader";
import RouteProgress from "./sharedcomponents/RouteProgress";
import RestrictedArea from "./sharedcomponents/RestrictedArea";

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
      <BrowserRouter>
        <RouteProgress />
        <Navbar />
        <main className="grow">
          <Routes>
            <Route
              index
              element={
                <Suspense fallback={<RouteFallback variant="landing" />}>
                  <RestrictedArea variant="landing">
                    <LandingPage />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="login"
              element={
                <Suspense fallback={<RouteFallback variant="login" />}>
                  <RestrictedArea variant="login">
                    <Login />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="register"
              element={
                <Suspense fallback={<RouteFallback variant="register" />}>
                  <RestrictedArea variant="register">
                    <Register />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="donor-dashboard"
              element={
                <Suspense
                  fallback={<RouteFallback variant="donor-dashboard" />}
                >
                  <RestrictedArea variant="donor-dashboard">
                    <DonorDashboard />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="staff-dashboard"
              element={
                <Suspense
                  fallback={<RouteFallback variant="staff-dashboard" />}
                >
                  <RestrictedArea variant="staff-dashboard">
                    <StaffDashboard />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="donor-profile"
              element={
                <Suspense fallback={<RouteFallback variant="donor-profile" />}>
                  <RestrictedArea variant="donor-profile">
                    <DonorProfile />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="request/new"
              element={
                <Suspense fallback={<RouteFallback variant="new-request" />}>
                  <RestrictedArea variant="new-request">
                    <NewRequest />
                  </RestrictedArea>
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback variant="notfound" />}>
                  <RestrictedArea variant="notfound">
                    <NotFoundPage />
                  </RestrictedArea>
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
