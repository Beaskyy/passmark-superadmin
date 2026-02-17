"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { subject: "Math", AI: 85, Human: 78 },
  { subject: "Physics", AI: 88, Human: 82 },
  { subject: "Chem", AI: 92, Human: 88 },
  { subject: "Bio", AI: 90, Human: 85 },
  { subject: "Hist", AI: 78, Human: 75 },
];

export function AiVsHumanChart() {
  return (
    <Card className="bg-[#1E293B] border-[#334155] text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-bold">
          AI vs Human Scores
        </CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
            <span className="text-gray-400">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
            <span className="text-gray-400">Human</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={8}
            >
              <CartesianGrid
                vertical={false}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="subject"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "#334155", opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="AI"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Human"
                fill="#64748B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
