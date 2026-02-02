// lib/hooks/use-admin-overview.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminOverviewResponse } from "@/types/api";
import { useSession } from "next-auth/react";

async function fetchAdminOverview(token: string): Promise<AdminOverviewResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/overview/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Important for CORS with credentials
    }
  );
  
  console.log("Direct Django API call - Status:", response.status);
  console.log("Direct Django API call - URL:", `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/overview/`);
  
  if (!response.ok) {
    // Try to get error message
    let errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, get text
      const text = await response.text();
      if (text) errorMessage = text.substring(0, 200);
    }
    
    console.error("Django API error:", errorMessage);
    
    if (response.status === 401 || response.status === 403) {
      // Trigger NextAuth signOut and redirect
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log("Django API success data:", data);
  return data;
}

export function useAdminOverview() {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ["admin-overview", session?.accessToken],
    queryFn: () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return fetchAdminOverview(session.accessToken);
    },
    enabled: !!session?.accessToken, // Only run when we have a token
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}