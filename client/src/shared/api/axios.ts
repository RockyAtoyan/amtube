import axios from "axios";
import Cookies from "js-cookie";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../config/auth/auth.confg";
import { ROUTES } from "./routes";

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

authInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);

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
        const response = await publicInstance.get(
          ROUTES.auth.refreshAccessToken.path,
        );

        return authInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
