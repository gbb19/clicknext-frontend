import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuthActions } from "@/lib/hooks/useAuth";
import { RegisterData } from "@/types/auth";
import TextField from "@/components/text-field";
import PasswordTextField from "@/components/password-field";
import GradientButton from "@/components/gradeint-button";

export default function RegisterForm() {
  const [userData, setUserData] = useState<RegisterData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error } = useAuthActions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.password_confirmation
    ) {
      setValidationError("Please fill in all fields.");
      return false;
    }

    if (userData.password !== userData.password_confirmation) {
      setValidationError("Password and Confirm Password do not match");
      return false;
    }

    if (userData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
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

    await register(userData);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#1c9e56]">
      <div className="flex flex-col w-full max-w-md gap-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-[#363636]">BRoom</h1>
          <p className="mt-2 text-2xl text-[#363636]">Register</p>
        </div>
        <hr className="mb-6 border-t-2 border-[#e5e5e5]" />

        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* First name */}
          <TextField
            name="first_name"
            value={userData.first_name}
            placeholder="First name"
            onChange={handleChange}
          />

          {/* Last name */}
          <TextField
            name="last_name"
            value={userData.last_name}
            placeholder="Last name"
            onChange={handleChange}
          />

          {/* Username */}
          <TextField
            name="username"
            value={userData.username}
            placeholder="Username"
            onChange={handleChange}
          />

          {/* Email */}
          <TextField
            name="email"
            value={userData.email}
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />

          {/* Password */}
          <PasswordTextField
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <PasswordTextField
            name="password_confirmation"
            placeholder="Confirm Password"
            value={userData.password_confirmation}
            onChange={handleChange}
          />

          <GradientButton
            text={loading ? "Registering..." : "Register"}
            type="submit"
            disabled={loading}
          />
        </form>

        <div className="mt-4 text-center">
          <p className="text-lg font-normal text-[#363636]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#1c9e56] hover:underline">
              Login here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
