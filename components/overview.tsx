// components/overview.tsx
"use client";

import {
  BookOpen,
  Building2,
  CheckCircle,
  FileCheck,
  FileText,
  ClipboardList,
  Users,
  UserCheck,
} from "lucide-react";
import { CardComponent } from "@/components/card-component";
import { Button } from "@/components/ui/button";
import { OverviewSkeleton } from "@/components/overview-skeleton";
import { useSession } from "next-auth/react";
import { useAdminOverview } from "@/hooks/use-admin-overview";
import { ScriptsMarkedChart } from "@/components/dashboard/scripts-marked-chart";
import { AiVsHumanChart } from "@/components/dashboard/ai-vs-human-chart";
import { ActiveUsersTable } from "@/components/dashboard/active-users-table";

const Overview = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data, isLoading, error, refetch } = useAdminOverview();

  if (sessionStatus === "loading") {
    return <OverviewSkeleton />;
  }

  if (sessionStatus === "unauthenticated" || !session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Please log in</h2>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (error || !data?.data) {
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
            Error: {error?.message || "Failed to load summary"}
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
              onClick={() => (window.location.href = "/login")}
            >
              Re-login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const d = data.data;

  return (
    <main className="flex flex-col gap-8">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
        <div>
          <h2 className="md:text-2xl text-xl font-bold">Dashboard Overview</h2>
          <p className="text-sm text-[#94A3B8]">
            Welcome back, {session.user?.name || "Admin"}! Here&apos;s your
            summary.
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardComponent
          title="Total Users"
          content={d.total_users.toLocaleString()}
          bgColor="#3B82F61A"
          color="#3B82F6"
          color2="#64748B"
          trendText="Registered users"
          icon={Users}
          trendIcon={Users}
          href="/users"
        />

        <CardComponent
          title="Active Users"
          content={d.total_active_users.toLocaleString()}
          bgColor="#22C55E1A"
          color="#22C55E"
          color2="#64748B"
          trendText="Currently active"
          icon={UserCheck}
          trendIcon={CheckCircle}
          href="/active-users" 
        />

        <CardComponent
          title="Total Scripts"
          content={d.total_scripts.toLocaleString()}
          bgColor="#A855F71A"
          color="#A855F7"
          color2="#64748B"
          trendText="All scripts"
          icon={FileText}
          trendIcon={FileText}
          href="/scripts"
        />

        <CardComponent
          title="Scripts Marked"
          content={d.total_scripts_marked.toLocaleString()}
          bgColor="#EAB3081A"
          color="#EAB308"
          color2="#64748B"
          trendText="Graded / marked"
          icon={FileCheck}
          trendIcon={CheckCircle}
          href="/scripts?filter=marked"
        />

        <CardComponent
          title="Total Courses"
          content={d.total_courses.toLocaleString()}
          bgColor="#EC48991A"
          color="#EC4899"
          color2="#64748B"
          trendText="Courses"
          icon={BookOpen}
          trendIcon={BookOpen}
          href="/courses"
        />

        <CardComponent
          title="Total Assessments"
          content={d.total_assessments.toLocaleString()}
          bgColor="#06B6D41A"
          color="#06B6D4"
          color2="#64748B"
          trendText="Assessments"
          icon={ClipboardList}
          trendIcon={ClipboardList}
          href="/assessments"
        />

        <CardComponent
          title="Organisations"
          content={d.total_organisations.toLocaleString()}
          bgColor="#8B5CF61A"
          color="#8B5CF6"
          color2="#64748B"
          trendText="Organisations"
          icon={Building2}
          trendIcon={Building2}
          href="/organisations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="">
          <ScriptsMarkedChart />
        </div>
        <div className="">
          <AiVsHumanChart />
        </div>
      </div>

      <div>
        <ActiveUsersTable />
      </div>
    </main>
  );
};

export default Overview;
