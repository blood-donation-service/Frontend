import LandingPage from "./features/landing/LandingPage";
import Login from "./features/login/Login";
import DonorRegister from "./features/register/DonorRegister";
import StaffRegister from "./features/register/StaffRegister";
import DonorDashboard from "./features/donor/DonorDashboard";
import StaffDashboard from "./features/staff/StaffDashboard";
import DonorProfile from "./features/donor/DonorProfile";
import NewRequest from "./features/staff/NewRequest";
import ToastNotifications from "./sharedcomponents/ToastNotifications";
import Navbar from "./sharedcomponents/Navbar";
import Footer from "./sharedcomponents/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 font-sans leading-relaxed text-slate-800"
      dir="rtl"
    >
      <ToastNotifications />

      {/* DYNAMIC VIEW ROUTER */}
      <BrowserRouter>
        <Navbar />
        <main className="grow">
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="donor-reg" element={<DonorRegister />} />
            <Route path="staff-reg" element={<StaffRegister />} />
            <Route path="donor-dashboard" element={<DonorDashboard />} />
            <Route path="staff-dashboard" element={<StaffDashboard />} />
            <Route path="donor-profile" element={<DonorProfile />} />
            <Route path="request/new" element={<NewRequest />} />
          </Routes>
        </main>
      </BrowserRouter>

      <Footer />
    </div>
  );
}
