"use client";
import { LogOut } from "lucide-react";
import { useAuthActions } from "@/lib/hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuthActions();

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm border border-gray-300">
      <div className="text-2xl font-bold text-teal-500">BBoard</div>
      <div className="flex items-center space-x-4">
        <div
          className="cursor-pointer transform active:scale-95 transition-all hover:bg-gray-200 hover:text-teal-500"
          onClick={logout}
        >
          <LogOut className="text-gray-600" />
        </div>
      </div>
    </nav>
  );
}
