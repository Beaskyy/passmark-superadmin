"use client";

import { useQuery } from "@tanstack/react-query";
import { UserCoursesResponse } from "@/types/api";
import { useSession } from "next-auth/react";

interface UseUserCoursesOptions {
  userId: string | number;
  enabled?: boolean;
  accessToken?: string;
}

async function fetchUserCourses({ userId, accessToken }: { userId: string | number; accessToken?: string }): Promise<UserCoursesResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin-api/users/${userId}/courses/`;

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

  const data = (await response.json()) as UserCoursesResponse;
  
  if (!data?.data || !Array.isArray(data.data)) {
      throw new Error("Invalid user courses response");
  }

  return data;
}

export function useUserCourses({ userId, enabled }: Omit<UseUserCoursesOptions, "accessToken">) {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["user-courses", userId, accessToken],
    queryFn: () => fetchUserCourses({ userId, accessToken }),
    enabled: (enabled ?? true) && sessionStatus === "authenticated" && !!accessToken && !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 60 * 1000, // 1 minute
  });
}
