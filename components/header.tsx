"use client";

import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  PlusCircle, 
  CircleHelp, 
  ChevronDown, 
  Command 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Navigation } from "./navigation"; // Ensure this path is correct
import { toast } from "sonner";

export const Header = () => {
  const logout = async () => {
    try {
      // Call the logout API if needed
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  return (
    <header className="px-6 h-[72px] border-b border-[#1E293B] bg-[#0F172A] flex items-center justify-between sticky top-0 z-50">
      
      {/* 1. Left Side: Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5 group-focus-within:text-[#3B82F6] transition-colors" />
          <Input
            type="text"
            className="h-[44px] w-full bg-[#1E293B] border border-[#334155] rounded-lg pl-10 pr-20 text-[#CBD5E1] placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-0 focus-visible:border-[#3B82F6]"
            placeholder="Search assessments, users, or scripts..."
          />
          {/* Keyboard Shortcuts */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 items-center pointer-events-none">
            <div className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-[#334155]/50 border border-[#475569] text-[#94A3B8]">
              <Command className="w-3 h-3" />
            </div>
            <div className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-[#334155]/50 border border-[#475569] text-[10px] font-medium text-[#94A3B8]">
              K
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Actions & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex">
          <Navigation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* New Assessment Button */}
          <Button 
            variant="ghost" 
            className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#3B82F6]/10 gap-2 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            New Assessment
          </Button>

          {/* Vertical Separator */}
          <div className="h-6 w-[1px] bg-[#334155]" />

          {/* Notification Bell */}
          <button className="relative p-2 text-[#94A3B8] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#0F172A]" />
          </button>

          {/* Help Icon */}
          <button className="p-2 text-[#94A3B8] hover:text-white transition-colors">
            <CircleHelp className="w-5 h-5" />
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-2 pl-2 cursor-pointer">
                <Avatar className="w-8 h-8 border border-[#334155]">
                  <AvatarImage src="/images/avatar.svg" alt="User" />
                  <AvatarFallback className="bg-[#1E293B] text-[#94A3B8]">BS</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155] text-[#CBD5E1]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#334155]" />
              <DropdownMenuItem className="cursor-pointer focus:bg-[#334155] focus:text-white" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};