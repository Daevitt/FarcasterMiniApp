'use client'
import React from "react";
import { useAuthStore } from "@/lib/store";

export default function UserProfile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.pfpUrl ? (
        <img src={user.pfpUrl} alt="pfp" className="h-8 w-8 rounded-full" />
      ) : (
        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">{user.username?.charAt(0)?.toUpperCase()}</div>
      )}
      <div className="text-white text-sm">
        <div className="font-semibold">{user.displayName || user.username}</div>
        <div className="text-xs opacity-80">fid: {user.fid}</div>
      </div>
      <button
        onClick={() => logout()}
        className="ml-3 text-xs bg-white/10 px-2 py-1 rounded"
      >
        Cerrar
      </button>
    </div>
  );
}
