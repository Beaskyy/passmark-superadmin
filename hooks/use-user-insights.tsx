"use client";

import { useQuery } from "@tanstack/react-query";
import { UserInsightsResponse } from "@/types/api";
import { useSession } from "next-auth/react";

interface UseUserInsightsOptions {
  userId: string | number;
  enabled?: boolean;
  accessToken?: string;
}

async function fetchUserInsights({ userId, accessToken }: { userId: string | number; accessToken?: string }): Promise<UserInsightsResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin-api/users/${userId}/insights/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = (errorData.error ?? errorData.detail ?? errorData.message) ?? errorMessage;
    } catch {
      const text = await response.text();
      if (text) errorMessage = text.slice(0, 200);
    }
    if (response.status === 401 || response.status === 403) {
      // window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as UserInsightsResponse;
  
  // Basic validation
  if (!data?.data?.user_details) {
      throw new Error("Invalid user insights response");
  }

  return data;
}

export function useUserInsights({ userId, enabled }: Omit<UseUserInsightsOptions, "accessToken">) {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["user-insights", userId, accessToken],
    queryFn: () => fetchUserInsights({ userId, accessToken }),
    enabled: (enabled ?? true) && sessionStatus === "authenticated" && !!accessToken && !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 60 * 1000, // 1 minute
  });
}
