"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Settings, 
  LogOut, 
  Sparkles 
} from "lucide-react";
import { sidebarData } from "@/lib/data";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-[272px] bg-[#0B1120] h-screen fixed flex flex-col border-r border-[#1E293B]">
      
      {/* 1. Header Section */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2563EB] rounded-[8px] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 fill-white" />
        </div>
        <h1 className="text-white font-bold text-lg tracking-tight">ScriptMark AI</h1>
      </div>

      {/* 2. Scrollable Navigation Section */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-none">
        {sidebarData.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Group Label */}
            {group.group && (
              <h4 className="text-[#64748B] text-xs font-bold mb-4 px-4 uppercase tracking-wider">
                {group.group}
              </h4>
            )}
            
            {/* Links Loop */}
            <div className="space-y-0">
              {group.items.map((link) => {
                const isActive = pathname === link.href; // Simple active check
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-md transition-all duration-200 group",
                      isActive 
                        ? "bg-[#1E293B] text-[#3B82F6]" 
                        : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", isActive ? "text-[#3B82F6]" : "text-[#64748B] group-hover:text-white")} />
                      <span className="text-sm font-medium">{link.name}</span>
                    </div>
                    
                    {/* Optional "New" Badge */}
                    {link.badge && (
                      <span className="bg-[#172554] text-[#3B82F6] text-[10px] font-bold px-2 py-0.5 rounded border border-[#1E3A8A]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Section (Settings + Profile) */}
      <div className="p-4 space-y-6 pt-6 border-t border-[#1E293B]">
        {/* Settings Link */}
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-4 text-[#94A3B8] hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>

        {/* User Profile Card */}
        <div className="bg-[#1E293B]/50 rounded-xl p-3 flex items-center justify-between border border-[#334155]/50 hover:bg-[#1E293B] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#334155] flex items-center justify-center text-white font-medium text-sm">
                    JS
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold group-hover:text-[#3B82F6] transition-colors">Jane Smith</span>
                    <span className="text-[#64748B] text-xs">Super Admin</span>
                </div>
            </div>
            <LogOut className="w-4 h-4 text-[#64748B] hover:text-white" />
        </div>
      </div>
    </div>
  );
};