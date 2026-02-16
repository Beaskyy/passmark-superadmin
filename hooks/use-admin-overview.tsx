"use client";

import { useQuery } from "@tanstack/react-query";
import { SummaryResponse } from "@/types/api";
import { useSession } from "next-auth/react";

async function fetchSummary(): Promise<SummaryResponse> {
  const response = await fetch("/api/admin/summary", {
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

  const data = (await response.json()) as SummaryResponse;
  if (!data?.data) {
    throw new Error("Invalid summary response");
  }
  return data;
}

export function useAdminOverview() {
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["admin-summary"],
    queryFn: fetchSummary,
    enabled: sessionStatus === "authenticated" && !!session,
    retry: 1,
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000,
  });
}
