import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuthActions } from "@/lib/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";
import TextField from "@/components/text-field";
import PasswordTextField from "@/components/password-field";
import GradientButton from "@/components/gradeint-button";

export default function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const { login, loading, error } = useAuthActions();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!credentials.username || !credentials.password) {
      setValidationError("Please fill in all fields.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await login(credentials);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#1c9e56]">
      <div className="flex flex-col w-full max-w-md gap-6 p-8 bg-white rounded-xl shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-[#363636]">BBoard</h1>
          <p className="mt-2 text-xl text-[#363636]">Welcome to BBoard</p>
        </div>
        <hr className="mb-6 border-t-2 border-[#e5e5e5]" />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{" "}
        {/* แสดงข้อผิดพลาด */}
        {validationError && (
          <p className="text-red-500 text-center mb-4">{validationError}</p>
        )}{" "}
        {/* แสดงข้อความข้อผิดพลาดที่เรากำหนด */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ฟิลด์สำหรับ Username */}
          <TextField
            id="username"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />

          {/* ฟิลด์สำหรับ Password */}
          <PasswordTextField
            id="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />

          {/* ปุ่ม Sign In */}
          <GradientButton
            text={loading ? "Signing in..." : "Sign in"}
            type="submit"
            disabled={loading}
          />
        </form>
        <div className="flex flex-row justify-center gap-3 mt-4">
          <p className="text-lg font-normal text-[#363636]">
            You don’t have an account?
          </p>
          <Link
            href="/auth/register"
            className="text-lg font-medium text-[#1c9e56] hover:underline"
          >
            Create account.
          </Link>
        </div>
      </div>
    </div>
  );
}
