import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function addAuthToken(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = await localStorage.getItem("token");
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => addAuthToken(config),
  (error: Promise<never>) => Promise.reject(error)
);

export default axiosInstance;
