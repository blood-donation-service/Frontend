import { useNavigate, useLocation } from "react-router-dom";
import api from "../features/api/axios";
import { setUserRole, specifyUserInfo } from "./appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

const PUBLIC_PATHS = ["/register", "/login", "/", "/donor-dashboard"];

export default function RestrictedArea({ children, variant = "landing" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { userRole } = useSelector((store) => store.app);
  const [readyState, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (userRole) {
      return () => {
        cancelled = true;
      };
    }

    const reExtractingDataAfterRefreshing = async () => {
      const token = getCookie("access_token");
      if (!token) {
        if (!PUBLIC_PATHS.includes(pathname)) {
          navigate("/login");
        }
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const response = await api.get("/api/accounts/me/");
        if (cancelled) return;
        const { user, profile } = response.data;
        if (user?.role === "donor") {
          const reExteractedDonorData = {
            id: user?.id,
            name: profile?.first_name + " " + profile?.last_name,
            nationalCode: user?.username,
            mobileNumber: profile?.mobile_number,
            bloodGroup: profile?.blood_group,
            province: profile?.province,
          };
          dispatch(specifyUserInfo(reExteractedDonorData));
          dispatch(setUserRole("donor"));
        } else {
          const reExteractedStaffData = {
            id: user?.id,
            name: profile?.first_name + " " + profile?.last_name,
            nationalCode: user?.username,
            mobileNumber: profile?.mobile_number,
            medicalCenter: {
              id: profile?.medical_center?.id,
              centerId: profile?.medical_center?.center_id,
              name: profile?.medical_center?.name,
              postalCode: profile?.medical_center?.postal_code,
              address: profile?.medical_center?.address,
              phoneNumber: profile?.medical_center?.phone_number,
            },
          };
          dispatch(specifyUserInfo(reExteractedStaffData));
          dispatch(setUserRole("staff"));
        }
      } catch {
        if (cancelled) return;
        if (!PUBLIC_PATHS.includes(pathname)) {
          navigate("/login");
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    };
    reExtractingDataAfterRefreshing();
    return () => {
      cancelled = true;
    };
  }, [navigate, dispatch, pathname, userRole]);

  const ready = !!userRole || readyState;

  if (!ready) {
    return <PageLoader variant={variant} />;
  }

  return <>{children}</>;
}
