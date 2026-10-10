"use client";

import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const [loading,setLoading]=useState(false);
  async function logout() {
    setLoading(true);
    try {
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_token");
      document.cookie = "access_token=; path=/; max-age=0";
    } catch {}
    await fetch("/api/v1/auth/logout",{method:"POST"});
    window.location.href="/admin/login";
  }
  return <button className={className} type="button" onClick={logout} disabled={loading}>{loading?"در حال خروج…":"خروج"}</button>;
}