import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../features/api/axios";
import { useDispatch } from "react-redux";
import { showToast } from "./appSlice";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

const PUBLIC_PATHS = ["/register", "/login", "/", "/donor-dashboard"];

export function useUserInfo() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["fetch_user_info"],
    queryFn: async () => {
      const token = getCookie("access_token");
      if (!token) {
        if (!PUBLIC_PATHS.includes(pathname)) navigate("/login");
        return;
      }
      try {
        const response = await api.get("/api/accounts/me/");
        return response.data;
      } catch (error) {
        const errorMessage = error.message.includes("Network Error")
          ? "خطا در اتصال به اینترنت"
          : "خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.";
        dispatch(showToast("خطا در دریافت اطلاعات", errorMessage, "error"));
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
