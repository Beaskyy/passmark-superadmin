"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminOverviewResponse } from "@/types/api";

// Client-side fetch function
async function fetchAdminOverview(): Promise<AdminOverviewResponse> {
  const res = await fetch("/api/admin/overview");
  
  if (!res.ok) {
    if (res.status === 401) {
      // Redirect handled by middleware or NextAuth
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch admin overview");
  }
  
  return res.json();
}

// React Query hook
export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: fetchAdminOverview,
    retry: 1,
  });
}