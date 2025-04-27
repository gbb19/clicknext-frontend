// lib/hooks/useAuth.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../apis/api";
import { useAuth } from "../context/AuthContext";
import { LoginCredentials, RegisterData } from "@/types/auth";

export function useAuthActions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(credentials);
      // เก็บ token และข้อมูลผู้ใช้
      const token = data.token;
      const user = data.user;

      // เก็บข้อมูลใน localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // กำหนดเวลา expiry สำหรับ token (เช่น หมดอายุใน 1 ชั่วโมง)
      const expiry = Date.now() + 3600 * 1000; // 1 hour
      localStorage.setItem("token_expiry", expiry.toString());

      setUser(user);
      setIsAuthenticated(true);
      router.push("/board");
      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "There was an error while logging in. Please check your email and password."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      await register(userData);

      router.push("/auth/login");
      return;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("There was an error while registering. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiry");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/auth/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loading,
    error,
  };
}
