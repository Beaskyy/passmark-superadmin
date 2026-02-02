// components/overview.tsx
"use client";

import {
  CheckCircle,
  CircleCheck,
  Clock4,
  FileText,
  Hourglass,
  TrendingUp,
  TriangleAlert,
  Users,
  DollarSign,
} from "lucide-react";
import { CardComponent } from "@/components/card-component";
import { Button } from "@/components/ui/button";
import { OverviewSkeleton } from "@/components/overview-skeleton";
import { useSession } from "next-auth/react";
import { useAdminOverview } from "@/hooks/use-admin-overview";

const Overview = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data, isLoading, error, refetch } = useAdminOverview();

  // Show loading while checking authentication
  if (sessionStatus === "loading") {
    return <OverviewSkeleton />;
  }

  // If not authenticated
  if (sessionStatus === "unauthenticated" || !session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Please log in</h2>
        <Button onClick={() => window.location.href = "/login"}>
          Go to Login
        </Button>
      </div>
    );
  }

  // Show loading while fetching data
  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (error || !data) {
    return (
      <main className="flex flex-col gap-8">
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
          <div>
            <h2 className="md:text-2xl text-xl font-bold">Dashboard Overview</h2>
            <p className="text-sm text-[#94A3B8]">
              Unable to load dashboard data.
            </p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">
            Error: {error?.message || "Failed to load dashboard data"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              className="bg-[#135BEC] hover:bg-[#135beced]"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700"
              onClick={() => window.location.href = "/login"}
            >
              Re-login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Process data...
  const summary = data?.summary;
  const monthly = data?.monthly_stats;
  const scriptBreakdown = data?.breakdowns?.script_status || [];

  const totalScripts = summary?.total_scripts || 0;
  const pendingCount = scriptBreakdown
    .filter((item) => item.status === "in_queue" || item.status === "pending")
    .reduce((acc, curr) => acc + curr.count, 0);

  const totalRevenue = summary?.total_revenue || 0;
  const totalStudents = summary?.total_students || 0;
  const scriptGrowth = monthly?.scripts_growth_percentage || 0;
  const revenueGrowth = parseFloat(monthly?.revenue_growth_percentage || "0");

  return (
    <main className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
        <div>
          <h2 className="md:text-2xl text-xl font-bold">Dashboard Overview</h2>
          <p className="text-sm text-[#94A3B8]">
            Welcome back, {session.user?.name || "Admin"}! Here&apos;s what&apos;s happening with your scripts today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="bg-[#1E293B] hover:bg-[#1e293bed] py-2 px-4 h-[38px] text-sm font-bold"
            onClick={() => refetch()}
          >
            Refresh Data
          </Button>
          <Button className="bg-[#135BEC] hover:bg-[#135beced] h-[38px] text-sm font-bold">
            View Live Analytics
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <CardComponent
          title="Total Scripts"
          content={totalScripts.toLocaleString()}
          bgColor="#3B82F61A"
          color="#3B82F6"
          color2={scriptGrowth >= 0 ? "#22C55E" : "#EF4444"}
          trendText={`${scriptGrowth > 0 ? "+" : ""}${scriptGrowth}% this month`}
          icon={FileText}
          trendIcon={TrendingUp}
        />

        <CardComponent
          title="Pending Grading"
          content={pendingCount.toLocaleString()}
          bgColor="#EAB3081A"
          color="#EAB308"
          color2="#EAB308"
          trendText="Requires attention"
          icon={Hourglass}
          trendIcon={TriangleAlert}
        />

        <CardComponent
          title="Total Revenue"
          content={`$${totalRevenue.toLocaleString()}`}
          bgColor="#A855F71A"
          color="#A855F7"
          color2={revenueGrowth >= 0 ? "#22C55E" : "#EF4444"}
          trendText={`${revenueGrowth > 0 ? "+" : ""}${revenueGrowth.toFixed(1)}% this month`}
          icon={DollarSign}
          trendIcon={revenueGrowth >= 0 ? CircleCheck : TrendingUp}
        />

        <CardComponent
          title="Total Students"
          content={totalStudents.toLocaleString()}
          bgColor="#22C55E1A"
          color="#22C55E"
          color2="#64748B"
          trendText="Across all organisations"
          icon={Users}
          trendIcon={Clock4}
        />
      </div>
    </main>
  );
};

export default Overview;