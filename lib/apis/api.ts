import { AuthResponse, LoginCredentials, RegisterData } from "@/types/auth";
import axiosInstance from "@/lib/apis/axios";

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", {
    username: userData.username,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    password: userData.password,
  });
  return response.data;
};
