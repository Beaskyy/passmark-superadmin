"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  renderToolbar?: (table: import("@tanstack/react-table").Table<TData>) => React.ReactNode
  pageCount?: number
  rowCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: import("@tanstack/react-table").OnChangeFn<import("@tanstack/react-table").PaginationState>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderToolbar,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  // Internal pagination state if not controlled
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })

  // Determine if controlled
  const isControlled = pagination !== undefined
  const finalPagination = isControlled ? pagination : internalPagination
  const finalOnPaginationChange = isControlled ? onPaginationChange : setInternalPagination

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1, // -1 enables client-side pagination if not manual
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: finalPagination,
    },
    enableRowSelection: true,
    manualPagination: isControlled, // Enable manual pagination if state is provided
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: finalOnPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  
  // Helpers for pagination display
  const totalRows = rowCount ?? table.getFilteredRowModel().rows.length
  const pageIndex = finalPagination.pageIndex
  const pageSize = finalPagination.pageSize
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  // Generate page numbers
  const totalPages = table.getPageCount()
  const pageNumbers = []
  if (totalPages <= 7) {
     for (let i = 0; i < totalPages; i++) pageNumbers.push(i)
  } else {
     // Simplified complex pagination for now: First 1, Current, Last
     if (pageIndex < 4) {
         pageNumbers.push(0, 1, 2, 3, 4, -1, totalPages - 1)
     } else if (pageIndex > totalPages - 5) {
         pageNumbers.push(0, -1, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1)
     } else {
         pageNumbers.push(0, -1, pageIndex - 1, pageIndex, pageIndex + 1, -1, totalPages - 1)
     }
  }

  return (
    <div className="space-y-4">
      {renderToolbar && renderToolbar(table)}
      <div className="rounded-md border border-[#1E293B] bg-[#0F172A] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1E293B]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-[#1E293B] hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-[#94A3B8] font-bold text-xs uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b-[#1E293B] hover:bg-[#1E293B]/50 data-[state=selected]:bg-[#1E293B]/50"
                  onClick={() => row.toggleSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-[#F8FAFC]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[#94A3B8]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination */}
       <div className="flex md:flex-row flex-col md:items-center justify-between px-2 gap-4">
        <div className="flex-1 text-sm text-[#94A3B8]">
            {totalRows > 0 ? (
                <>
                Showing <span className="font-medium text-white">{startRow}</span>-
                <span className="font-medium text-white">{endRow}</span> of{" "}
                <span className="font-medium text-white">{totalRows}</span> users
                </>
            ) : (
                "No users found"
            )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-[#94A3B8] cursor-pointer hover:text-white disabled:opacity-50" 
                  onClick={() => table.previousPage()}
                  aria-disabled={!table.getCanPreviousPage()}
                  style={{ pointerEvents: !table.getCanPreviousPage() ? 'none' : 'auto', opacity: !table.getCanPreviousPage() ? 0.5 : 1 }}
                  >
                Previous
            </span>
             
            {pageNumbers.map((page, idx) => (
                page === -1 ? (
                    <span key={`ellipsis-${idx}`} className="text-[#94A3B8]">...</span>
                ) : (
                    <Button
                        key={page}
                        variant={page === pageIndex ? "default" : "ghost"}
                        className={`h-8 w-8 p-0 ${page === pageIndex ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white" : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"}`}
                        onClick={() => table.setPageIndex(page)}
                    >
                        {page + 1}
                    </Button>
                )
            ))}

            <span className="text-sm font-medium text-[#94A3B8] cursor-pointer hover:text-white" 
                  onClick={() => table.nextPage()}
                  aria-disabled={!table.getCanNextPage()}
                  style={{ pointerEvents: !table.getCanNextPage() ? 'none' : 'auto', opacity: !table.getCanNextPage() ? 0.5 : 1 }}
                  >
                Next
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
