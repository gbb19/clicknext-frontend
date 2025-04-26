// app/workspace/layout.tsx
"use client";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar"; // นำเข้า usePathname

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
