"use client";

import { useQuery } from "@tanstack/react-query";
import { SummaryResponse } from "@/types/api";
import { useSession } from "next-auth/react";

async function fetchSummary(token: string): Promise<SummaryResponse> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const url = `${baseUrl}/admin-api/summary/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = (errorData.detail ?? errorData.message ?? errorData.error) ?? errorMessage;
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

  const data = (await response.json()) as SummaryResponse;
  if (!data?.data) {
    throw new Error("Invalid summary response");
  }
  return data;
}

export function useAdminOverview() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin-summary", session?.accessToken],
    queryFn: () => {
      if (!session?.accessToken) throw new Error("No access token available");
      return fetchSummary(session.accessToken);
    },
    enabled: !!session?.accessToken,
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000,
  });
}
