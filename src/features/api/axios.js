import axios from "axios";

const TOKEN_STORAGE_KEY = "access_token";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// const api: AxiosInstance = axios.create({
//   baseURL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const getAccessToken = () => {
  return getCookie(TOKEN_STORAGE_KEY);
};

// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${token}`,
//       };
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error),
// );

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // or from context/state // or from context/state
    if (token && config.headers) {
      // Ensure headers exist and add Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 498) {
      document.cookie = `${TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    return Promise.reject(error);
  },
);

export default api;
