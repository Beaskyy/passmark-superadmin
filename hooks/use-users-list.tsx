"use client";

import { useQuery } from "@tanstack/react-query";
import { UsersListResponse } from "@/types/api";
import { useSession } from "next-auth/react";

interface UseUsersListOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

async function fetchUsersList(options?: UseUsersListOptions): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));

  const url = `/api/admin/users/list${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as UsersListResponse;
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("Invalid users list response");
  }
  return data;
}

export function useUsersList(options?: UseUsersListOptions) {
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["users-list", options?.page, options?.limit],
    queryFn: () => fetchUsersList(options),
    enabled: (options?.enabled ?? true) && sessionStatus === "authenticated" && !!session,
    retry: 1,
    retryDelay: 1000,
    staleTime: 30 * 1000, // 30 seconds
  });
}
