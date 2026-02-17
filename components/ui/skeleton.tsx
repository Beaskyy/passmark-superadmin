import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800", className)} // Using slate-800 to match dark theme better than generic muted
      {...props}
    />
  )
}

export { Skeleton }
