"use client";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar"; // นำเข้า usePathname

interface BoardLayoutProps {
  children: ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
