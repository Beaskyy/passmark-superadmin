import { CheckCircle, CircleCheck, Clock4, FileText, Hourglass, Sparkle, TrendingUp, TriangleAlert, Users } from "lucide-react";
import { CardComponent } from "./card-component";
import { Button } from "./ui/button";

const Overview = () => {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
        <div>
          <h2 className="md:text-2xl text-xl font-bold">Dashboard Overview</h2>
          <p className="text-sm text-[#94A3B8]">
            Welcome back, here&apos;s what&apos;s happening with your scripts
            today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-[#1E293B] hover:bg-[#1e293bed] py-2 px-4 h-[38px] text-sm font-bold">
            Export Data
          </Button>
          <Button className="bg-[#135BEC] hover:bg-[#135beced] h-[38px] text-sm font-bold">
            View Live Analytics
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <CardComponent
          title="Total Scripts"
          content="24,592"
          bgColor="#3B82F61A"
          color="#3B82F6"
          color2="#22C55E"
          trendText="+12% this week"
          icon={FileText}
          trendIcon={TrendingUp}
        />
        <CardComponent
          title="Pending Grading"
          content="1,204"
          bgColor="#EAB3081A"
          color="#EAB308"
          color2="#EAB308"
          trendText="Requires attention"
          icon={Hourglass}
          trendIcon={TriangleAlert}
        />
        <CardComponent
          title="AI Accuracy"
          content="98.4%"
          bgColor="#A855F71A"
          color="#A855F7"
          color2="#22C55E"
          trendText="Optimal performance"
          icon={Sparkle}
          trendIcon={CircleCheck}
        />
        <CardComponent
          title="Active Users"
          content="342"
          bgColor="#22C55E1A"
          color="#22C55E"
          color2="#64748B"
          trendText="updated 2m ago"
          icon={Users}
          trendIcon={Clock4}
        />
      </div>
    </main>
  );
};

export default Overview;
