"use client";
import GradientButton from "@/components/gradeint-button";
import { useAuth } from "@/lib/context/AuthContext";

export default function WorkspacePage() {
  const { user } = useAuth();
  return (
    <div className="bg-white h-screen w-full p-8 flex flex-col">
      <div className="flex gap-4 justify-end">
        <GradientButton
          text="Create Workspace"
          width="w-40"
          onClick={() => {}} // เมื่อคลิกจะเปิด Modal
        />
      </div>
      <h1 className="text-2xl font-bold my-4 text-black">My Workspaces</h1>

      <div>
        <h1>Workspace</h1>
        <p>Welcome to the workspace!</p>
        <p>User: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <p>FirstName: {user?.first_name}</p>
        <p>LastName: {user?.last_name}</p>
      </div>
      <div className="grid grid-cols-3 gap-8 overflow-auto py-6">
        <p className="text-gray-500">No workspace 😢</p>
      </div>
    </div>
  );
}
