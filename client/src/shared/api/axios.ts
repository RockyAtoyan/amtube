import axios from "axios";

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const LOCAL_STORAGE_TOKEN = "amtube-access-token";

authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
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
        localStorage.setItem(LOCAL_STORAGE_TOKEN, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
