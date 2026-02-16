"use client";

import { useQuery } from "@tanstack/react-query";
import { SummaryResponse } from "@/types/api";
import { useSession } from "next-auth/react";

async function fetchSummary(): Promise<SummaryResponse> {
  const res = await fetch("/api/admin/summary", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) window.location.href = "/login";
    const errorData = await res.json().catch(() => ({ error: "Failed to fetch summary" }));
    throw new Error(errorData.error ?? "Failed to fetch summary");
  }

  return res.json();
}

export function useAdminSummary() {
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["admin-summary"],
    queryFn: fetchSummary,
    enabled: sessionStatus === "authenticated" && !!session,
    retry: 1,
  });
}
