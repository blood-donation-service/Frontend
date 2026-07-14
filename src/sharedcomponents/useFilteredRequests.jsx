import { useQuery } from "react-query";
import api from "../features/api/axios";
import { showToast } from "./appSlice";
import { useDispatch } from "react-redux";

export function useFilteredRequests(bloodType, province) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["fetch_filtered_needs", bloodType, province],
    queryFn: async () => {
      try {
        const payload = {};
        if (bloodType && bloodType !== "All") payload.blood_group = bloodType;
        if (province && province !== "All") payload.province = province;
        const response = await api.get("/search/blood-requests/", {
          params: payload,
        });
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
    enabled:
      bloodType !== undefined && bloodType !== null && province !== undefined,
  });
}
