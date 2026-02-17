"use client"

import { Table } from "@tanstack/react-table"
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between p-1 bg-[#1E293B] rounded-lg mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
            placeholder="Search by name, email or ID..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-10 w-[350px] border-none bg-transparent pl-9 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
      </div>
      <div className="flex items-center gap-2 pr-1">
        
        {/* Mock Filter Button */}
        <Button variant="outline" className="h-8 border-none bg-[#0F172A] hover:bg-[#0F172A]/80 text-[#94A3B8] hover:text-white font-medium">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
        </Button>
        
        {/* Mock Sort Button */}
         <Button variant="outline" className="h-8 border-none bg-[#0F172A] hover:bg-[#0F172A]/80 text-[#94A3B8] hover:text-white font-medium">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
        </Button>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 text-[#94A3B8] hover:text-white"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
