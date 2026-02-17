"use client"

import { Button } from "@/components/ui/button"
import { columns, User as UIUser } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { DataTableToolbar } from "./data-table-toolbar"
import { Plus, Upload, Loader2, AlertCircle } from "lucide-react"
import { useUsersList } from "@/hooks/use-users-list"
import { User as ApiUser } from "@/types/api"
import * as React from "react"
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton"

const Users = () => {
    // Pagination state
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    })

    const { data: usersData, isLoading, isError, error } = useUsersList({
        page: pagination.pageIndex + 1, // API uses 1-based indexing
        limit: pagination.pageSize
    })

    const mapApiUserToUiUser = (user: ApiUser): UIUser => {
        let role: UIUser["role"] = "Student"
        if (user.is_superuser) role = "Administrator"
        else if (user.is_staff) role = "Examiner"
        // "Head Examiner" logic is unknown from current API types

        return {
            id: String(user.user_id),
            userId: `USR-${String(user.user_id).padStart(4, '0')}`, // Mock format
            name: user.fullname,
            email: user.email,
            role: role,
            status: user.verified ? "Active" : "Inactive",
            avatarUrl: undefined, // API doesn't provide avatar
        }
    }

    const data: UIUser[] = usersData?.data?.map(mapApiUserToUiUser) ?? []
    const pageCount = usersData?.count ? Math.ceil(usersData.count / pagination.pageSize) : -1

  return (
    <main className="text-white">
      <div className="flex flex-col gap-2">
           <div className="flex md:flex-row flex-col items-center gap-6 justify-between mb-2">
            <div className="flex flex-col">
            <h2 className="md:text-[30px] text-xl font-bold">User Management</h2>
             <p className="text-[#94A3B8] text-sm">Manage system access, roles, and examiner permissions.</p>
            </div>
             <div className="flex items-center gap-2">
                <Button className="bg-[#1E293B] hover:bg-[#1E293B]/80 h-9 px-4 text-sm font-medium text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 h-9 px-4 text-sm font-medium text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
             </div>
           </div>

           {isLoading ? (
               <DataTableSkeleton rowCount={20} columnCount={6} />
           ) : isError ? (
               <div className="flex h-[400px] flex-col items-center justify-center gap-2 rounded-md border border-red-900/50 bg-[#0F172A] text-red-500">
                   <AlertCircle className="h-8 w-8" />
                   <p>Error loading users: {error?.message || "Unknown error"}</p>
                   <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
               </div>
           ) : (
                <DataTable 
                    data={data} 
                    columns={columns} 
                    renderToolbar={(table) => <DataTableToolbar table={table} />}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    pageCount={pageCount}
                    rowCount={usersData?.count}
                />
           )}
      </div>
    </main>
  )
}

export default Users