"use client";

import { useQuery } from "@tanstack/react-query";
import { ActiveUsersListResponse } from "@/types/api";
import { useSession } from "next-auth/react";

interface UseActiveUsersListOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
  accessToken?: string;
}

async function fetchActiveUsersList(options?: UseActiveUsersListOptions): Promise<ActiveUsersListResponse> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));

  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin-api/users/active/list/${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options?.accessToken}`,
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

  const data = (await response.json()) as ActiveUsersListResponse;
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("Invalid active users list response");
  }
  return data;
}

export function useActiveUsersList(options?: UseActiveUsersListOptions) {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["active-users-list", options?.page, options?.limit, accessToken],
    queryFn: () => fetchActiveUsersList({ ...options, accessToken }),
    enabled: (options?.enabled ?? true) && sessionStatus === "authenticated" && !!accessToken,
    retry: 1,
    retryDelay: 1000,
    staleTime: 30 * 1000, // 30 seconds
  });
}
