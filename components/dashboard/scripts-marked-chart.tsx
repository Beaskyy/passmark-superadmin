"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: "Mon", scripts: 2400 },
  { day: "Tue", scripts: 4000 },
  { day: "Wed", scripts: 3000 },
  { day: "Thu", scripts: 7000 },
  { day: "Fri", scripts: 5500 },
  { day: "Sat", scripts: 8500 },
  { day: "Sun", scripts: 4500 },
];

export function ScriptsMarkedChart() {
  return (
    <Card className="bg-[#1E293B] border-[#334155] text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-bold">
          Scripts Marked Over Time
        </CardTitle>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[120px] bg-[#0F172A] border-[#334155] text-xs h-8">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-[#1E293B] border-[#334155] text-white">
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
                cursor={{ stroke: "#334155" }}
              />
              <Line
                type="monotone"
                dataKey="scripts"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
