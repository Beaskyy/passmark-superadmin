"use client";

import { useActiveUsersList } from "@/hooks/use-active-users-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function ActiveUsersTable() {
  const { data, isLoading } = useActiveUsersList({ limit: 5 });
  const users = data?.data || [];

  return (
    <Card className="bg-[#1E293B] border-[#334155] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-base font-bold">Active Users</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-[#334155] border-transparent text-gray-300 hover:bg-[#475569] hover:text-white"
          >
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-[#334155] border-transparent text-gray-300 hover:bg-[#475569] hover:text-white"
          >
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#334155]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#334155] hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                  User Name
                </TableHead>
                <TableHead className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                  Last Active
                </TableHead>
                <TableHead className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                  Current Task
                </TableHead>
                <TableHead className="text-right text-gray-400 font-bold text-xs uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b-[#334155] hover:bg-transparent"
                  >
                    <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full bg-[#334155]" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px] bg-[#334155]" />
                                <Skeleton className="h-3 w-[100px] bg-[#334155]" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-[#334155]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-[#334155]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-[#334155]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto bg-[#334155]" /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow className="border-b-[#334155] hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-400"
                  >
                    No active users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.user_id}
                    className="border-b-[#334155] hover:bg-[#334155]/20"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-[#334155]">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullname}`} />
                          <AvatarFallback className="bg-[#0F172A] text-gray-300">
                            {user.fullname.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {user.fullname}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`
                          ${
                            user.is_superuser
                              ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                              : user.is_staff
                              ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
                              : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                          }
                          border-transparent font-normal
                        `}
                      >
                        {user.is_superuser
                          ? "Admin"
                          : user.is_staff
                          ? "Staff"
                          : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-gray-300 text-sm">
                          {/* Mocking specific time for now as API might not return last_active timestamp yet */}
                          {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'Just now'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-300 text-sm">
                        {user.scripts_marked_count > 0 ? `Marking ${user.scripts_marked_count} scripts` : "Idle"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#334155]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="text-xs text-gray-400">
            Showing {users.length} of {data?.count || 0} users
          </div>
          <div className="flex items-center gap-2">
             <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-[#334155] border-transparent text-gray-300 hover:bg-[#475569] hover:text-white"
                disabled={!data?.previous}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-[#334155] border-transparent text-gray-300 hover:bg-[#475569] hover:text-white"
                disabled={!data?.next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
