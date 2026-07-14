import { useQuery } from "react-query";
import api from "../features/api/axios";
import { useDispatch } from "react-redux";
import { showToast } from "./appSlice";

function useDonorReservation() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["fetch_donor_reserve"],
    queryFn: async () => {
      try {
        const response = await api.get("/blood/donations/me");
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

export default useDonorReservation;
