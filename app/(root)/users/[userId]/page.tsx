"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useUserInsights } from "@/hooks/use-user-insights"
import { useUserCourses } from "@/hooks/use-user-courses"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
    Mail, 
    Phone, 
    Building2, 
    Calendar, 
    Wallet, 
    BookOpen, 
    FileText, 
    CheckCircle,
    AlertCircle,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { UserCourse } from "@/types/api"

export default function UserInsightsPage() {
    const params = useParams()
    const userId = params.userId as string

    const { data: insightsData, isLoading, isError, error } = useUserInsights({ userId })

    if (isLoading) {
        return <UserInsightsSkeleton />
    }

    if (isError || !insightsData?.data) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-white">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-lg font-medium">Error loading user insights</p>
                <p className="text-sm text-slate-400">{error?.message || "Unknown error"}</p>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/users">Back to Users</Link>
                </Button>
            </div>
        )
    }

    const { user_details, credits, courses_count, assessments_count, scripts_count, scripts_marked_count } = insightsData.data

    return (
        <div className="space-y-6 text-white pb-10">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <Link href="/users">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">User Insights</h1>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-[#0F172A] border border-[#1E293B] p-6 rounded-xl">
                <Avatar className="h-24 w-24 border-4 border-[#1E293B]">
                    <AvatarImage src="" /> {/* API doesn't provide avatar URL yet */}
                    <AvatarFallback className="text-2xl bg-[#1E293B] text-white">
                        {user_details.fullname.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h2 className="text-3xl font-bold">{user_details.fullname}</h2>
                        <div className="flex gap-2">
                            {user_details.verified && <Badge variant="success">Verified</Badge>}
                            {user_details.is_superuser && <Badge className="bg-[#3B0764] text-[#A855F7] hover:bg-[#3B0764]/80 border-0">Super Admin</Badge>}
                            {user_details.is_staff && <Badge variant="warning">Staff</Badge>}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4" />
                            {user_details.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono bg-[#1E293B] px-2 py-0.5 rounded text-xs text-slate-300">
                                ID: {user_details.user_id}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                     {/* Action buttons could go here */}
                     <Button variant="outline" className="border-[#1E293B] hover:bg-[#1E293B] text-white">
                        Edit Profile
                     </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Credits Balance" 
                    value={credits.balance} 
                    icon={Wallet} 
                    color="text-emerald-400"
                    subtext={`${credits.total_earned} earned total`}
                />
                 <StatCard 
                    title="Courses Enrolled" 
                    value={courses_count} 
                    icon={BookOpen} 
                    color="text-blue-400"
                />
                 <StatCard 
                    title="Assessments Taken" 
                    value={assessments_count} 
                    icon={FileText} 
                    color="text-purple-400"
                />
                 <StatCard 
                    title="Scripts Marked" 
                    value={scripts_marked_count} 
                    subValue={`/ ${scripts_count} total`}
                    icon={CheckCircle} 
                    color="text-orange-400"
                />
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="md:col-span-2 bg-[#0F172A] border-[#1E293B] text-white">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Detailed user profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                         <InfoItem label="First Name" value={user_details.firstname} />
                         <InfoItem label="Last Name" value={user_details.lastname} />
                         <InfoItem label="Email Address" value={user_details.email} />
                         <InfoItem label="Phone Number" value={user_details.phone} />
                         <InfoItem label="Organization" value={user_details.organisation_name} icon={Building2} />
                         <InfoItem label="Department" value={user_details.department} />
                         <InfoItem label="Role" value={user_details.role} />
                         <InfoItem 
                            label="Joined On" 
                            value={new Date(user_details.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} 
                            icon={Calendar} 
                        />
                    </CardContent>
                </Card>

                {/* Activity Summary / Other Info */}
                <Card className="bg-[#0F172A] border-[#1E293B] text-white">
                    <CardHeader>
                        <CardTitle>Account Summary</CardTitle>
                         <CardDescription>Overview of account status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-[#1E293B]">
                             <span className="text-slate-400 text-sm">Status</span>
                             <Badge variant={user_details.verified ? "success" : "secondary"}>
                                 {user_details.verified ? "Active" : "Inactive"}
                             </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1E293B]">
                             <span className="text-slate-400 text-sm">Credits Spent</span>
                             <span className="font-medium">{credits.total_spent}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1E293B]">
                             <span className="text-slate-400 text-sm">User Type</span>
                             <span className="font-medium text-sm">
                                {user_details.is_superuser ? "Superuser" : user_details.is_staff ? "Staff" : "Standard"}
                             </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Courses Section */}
            <CoursesSection userId={userId} />
        </div>
    )
}

function CoursesSection({ userId }: { userId: string }) {
    const { data: coursesData, isLoading, isError } = useUserCourses({ userId })

    return (
        <Card className="bg-[#0F172A] border-[#1E293B] text-white">
            <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Courses the user is currently or previously enrolled in.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg bg-slate-800" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-red-400 text-sm">Failed to load courses.</div>
                ) : !coursesData?.data?.length ? (
                    <div className="text-slate-500 text-sm italic">No courses found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coursesData.data.map((course: UserCourse) => (
                            <div key={course.course_id} className="p-4 rounded-lg border border-[#1E293B] bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="bg-[#0F172A] text-slate-300 border-[#334155]">
                                        {course.code}
                                    </Badge>
                                    <span className="text-xs text-slate-500">{course.session || "No Session"}</span>
                                </div>
                                <h4 className="font-semibold text-sm mb-1 line-clamp-1" title={course.title}>{course.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.5em]">
                                    {course.description || "No description provided."}
                                </p>
                                <div className="mt-3 pt-3 border-t border-[#334155]/50 flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>Joined {new Date(course.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Sub-components for cleaner code

function StatCard({ title, value, subValue, icon: Icon, color, subtext }: any) {
    return (
        <Card className="bg-[#0F172A] border-[#1E293B] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}{subValue && <span className="text-sm text-slate-500 font-normal ml-1">{subValue}</span>}
                </div>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    )
}

function InfoItem({ label, value, icon: Icon }: any) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                {Icon && <Icon className="h-3 w-3" />}
                {label}
            </p>
            <p className="text-sm font-medium text-slate-200">
                {value || <span className="text-slate-600 italic">Not set</span>}
            </p>
        </div>
    )
}

function UserInsightsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse p-4">
             <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-md bg-slate-800" />
                <Skeleton className="h-8 w-48 rounded-md bg-slate-800" />
            </div>

             {/* Profile Header Skeleton */}
             <div className="h-40 rounded-xl bg-slate-800 w-full" />

             {/* Stats Grid Skeleton */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                     <div key={i} className="h-32 rounded-xl bg-slate-800" />
                ))}
             </div>

             {/* Details Skeleton */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-96 rounded-xl bg-slate-800" />
                <div className="h-96 rounded-xl bg-slate-800" />
             </div>
        </div>
    )
}
