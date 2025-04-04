import axios from "axios";
import Cookies from "js-cookie";

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const COOKIE_TOKEN = "amtube-access-token";

authInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(COOKIE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await publicInstance.get("/auth/refresh");

        const accessToken = response.data.accessToken;
        Cookies.set(COOKIE_TOKEN, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove(COOKIE_TOKEN);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
