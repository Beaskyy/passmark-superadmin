import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminOverviewResponse } from "@/types/api";

export async function getAdminOverview(): Promise<AdminOverviewResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    // Instead of redirecting, return null and handle in UI
    console.log("No session or access token");
    return null;
  }

  try {
    console.log("Fetching from external API...");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/overview/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        // Add cache control
        cache: "no-cache",
      }
    );

    console.log("External API response status:", res.status);
    console.log("External API response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("External API error:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText.substring(0, 500),
      });
      
      if (res.status === 401) {
        console.log("Token expired or invalid");
      }
      
      return null;
    }

    const data = await res.json();
    console.log("External API data received");
    return data;
  } catch (error) {
    console.error("Network error fetching admin overview:", error);
    return null;
  }
}