"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, MoreVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// This type is used to define the shape of our data.
export type User = {
  id: string
  name: string
  email: string
  role: "Head Examiner" | "Administrator" | "Student" | "Examiner"
  status: "Active" | "Reviewing" | "Inactive"
  avatarUrl?: string
  userId: string // e.g., USR-8821
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] border-[#334155] data-[state=checked]:bg-[#334155] data-[state=checked]:text-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] border-[#334155] data-[state=checked]:bg-[#334155] data-[state=checked]:text-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-[#334155] text-white">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-white">{user.name}</span>
            <span className="text-xs text-[#94A3B8]">ID: {user.userId}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      return (
        <div className="text-[#94A3B8]">{row.getValue("email")}</div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      let badgeStyle = "bg-[#1E293B] text-[#94A3B8] hover:bg-[#1E293B]/80"
      
      switch (role) {
        case "Head Examiner":
          badgeStyle = "bg-[#172554] text-[#3B82F6] hover:bg-[#172554]/80 border-0"
          break
        case "Administrator":
            badgeStyle = "bg-[#3B0764] text-[#A855F7] hover:bg-[#3B0764]/80 border-0" 
            break
        case "Student":
            badgeStyle = "bg-[#1E293B] text-[#94A3B8] hover:bg-[#1E293B]/80 border-0"
            break
        case "Examiner":
            badgeStyle = "bg-[#172554] text-[#3B82F6] hover:bg-[#172554]/80 border-0"
            break
      }

      return (
        <Badge className={`rounded-full px-3 py-1 font-normal ${badgeStyle}`}>
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let badgeVariant: "success" | "warning" | "neutral" = "neutral"
      let customClass = ""

      if (status === "Active") {
          badgeVariant = "success"
          customClass = "bg-[#052e16] text-[#22c55e] border-0"
      } else if (status === "Reviewing") {
          badgeVariant = "warning"
          customClass = "bg-[#422006] text-[#eab308] border-0"
      } else {
          customClass = "bg-[#1e293b] text-[#94a3b8] border-0"
      }

      return (
        <Badge variant={badgeVariant} className={`rounded-full px-3 font-medium ${customClass}`}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[#94A3B8] hover:text-white hover:bg-[#1E293B]">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155] text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="focus:bg-[#334155] focus:text-white cursor-pointer"
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#334155]" />
            <DropdownMenuItem className="focus:bg-[#334155] focus:text-white cursor-pointer">View customer</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[#334155] focus:text-white cursor-pointer">View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
