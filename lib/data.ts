import { 
  LayoutGrid, 
  Users, 
  GraduationCap, 
  FileText, 
  FileCode2, 
  BarChart3, 
  Wallet, 
  History, 
  Brain
} from "lucide-react";

export const sidebarData = [
  {
    group: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutGrid },
    ],
  },
  {
    group: "MANAGEMENT",
    items: [
      { name: "Users", href: "/users", icon: Users },
      { name: "Courses", href: "/courses", icon: GraduationCap },
      { name: "Assessments", href: "/assessments", icon: FileText },
      { name: "Scripts", href: "/scripts", icon: FileCode2, badge: "New" },
    ],
  },
  {
    group: "ANALYTICS & LOGS",
    items: [
      { name: "AI Performance", href: "/ai-performance", icon: Brain },
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Credits", href: "/credits", icon: Wallet },
      { name: "Logs", href: "/logs", icon: History },
    ],
  },
];