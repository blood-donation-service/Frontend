import { useQuery } from "react-query";
import api from "../features/api/axios";
import { useDispatch } from "react-redux";
import { showToast } from "./appSlice";

export function useRegisteredDonorsRequest(needId) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["fetch_registered_donors", needId],
    queryFn: async () => {
      try {
        const payload = {
          pk: needId,
        };
        const response = await api.get(`/blood/requests/${needId}/donors/`, {
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
  });
}
