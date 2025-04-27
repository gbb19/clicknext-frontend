// app/register/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "../../../components/auth/RegisterForm";
import { useAuth } from "@/lib/context/AuthContext";

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ถ้า user ล็อกอินแล้ว ให้ redirect ไปที่หน้า dashboard
    if (isAuthenticated && !loading) {
      router.push("/board");
    }
  }, [isAuthenticated, loading, router]);

  // ถ้าไม่ได้ล็อกอิน แสดง register form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm />
    </div>
  );
}
