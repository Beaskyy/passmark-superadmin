import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableSkeletonProps {
  rowCount?: number
  columnCount?: number
  showToolbar?: boolean
  showPagination?: boolean
}

export function DataTableSkeleton({
  rowCount = 10,
  columnCount = 5,
  showToolbar = true,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex items-center justify-between p-1 bg-[#1E293B] rounded-lg mb-4">
          <div className="flex flex-1 items-center space-x-2">
             <Skeleton className="h-10 w-[350px] bg-[#0F172A]" />
          </div>
          <div className="flex items-center gap-2 pr-1">
             <Skeleton className="h-8 w-20 bg-[#0F172A]" />
             <Skeleton className="h-8 w-20 bg-[#0F172A]" />
          </div>
        </div>
      )}
      
      <div className="rounded-md border border-[#1E293B] bg-[#0F172A] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1E293B]">
            <TableRow className="border-b-[#1E293B] hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24 bg-[#334155]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="border-b-[#1E293B] hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full bg-[#334155]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-2">
            <Skeleton className="h-4 w-40 bg-[#334155]" />
            <div className="flex items-center space-x-6 lg:space-x-8">
                <Skeleton className="h-8 w-60 bg-[#334155]" />
            </div>
        </div>
      )}
    </div>
  )
}
