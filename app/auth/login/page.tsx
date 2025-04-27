// app/login/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../../../components/auth/LoginForm";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/board");
    }
    console.log(user);
  }, [isAuthenticated, loading, router]);

  // ถ้าไม่ได้ล็อกอิน แสดง login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}
