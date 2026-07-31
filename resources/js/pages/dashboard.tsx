import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    ClipboardList,
    Clock,
    AlertTriangle,
    ShieldAlert,
    Siren,
    Check,
    CheckCheckIcon,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router, usePage } from '@inertiajs/react';
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function Dashboard({
    totalTrainees,
    activePasses,
    completedPasses,
    totalMinutesLate,
    recentActivity,
    passBreakdown,
    alphaCount,
    bravoCount,
    charlieCount,
    deltaCount,
}: any) {
    const [loading, setLoading] = React.useState(true);
    const { auth } = usePage().props as any;
    const roles = auth?.user?.roles ?? [];
    //
    const isUser = roles[0]?.name === 'User';

    React.useEffect(() => {
        if (isUser) {
            router.visit('/scanner');
        }
        setLoading(false);
    }, [isUser]);

    const formatTimestamp = (isoString: string | null) => {
        if (!isoString) return '—';

        try {
            const date = new Date(isoString);

            return (
                date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }) +
                ' ┃ ' +
                date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        } catch {
            return isoString;
        }
    };
    return (
        <div>
            {loading ? (
                <Spinner className="size-8" />
            ) : (
                <div>
                    <div className="space-y-6 p-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">
                                Trainees monitoring overview
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Total Trainees
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground text-primary" />
                                </CardHeader>
                                <CardContent className="text-5xl font-bold text-primary">
                                    {totalTrainees}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Active Passes
                                    </CardTitle>
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="text-5xl font-bold">
                                    {activePasses}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Completed Passes
                                    </CardTitle>
                                    <CheckCheckIcon className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent className="text-5xl font-bold text-green-600">
                                    {completedPasses}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        Trainees by Company
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-semibold">
                                                ALPHA
                                            </span>
                                            <span className="font-bold text-primary">
                                                {alphaCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm font-semibold">
                                                BRAVO
                                            </span>
                                            <span className="font-bold text-primary">
                                                {bravoCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm font-semibold">
                                                CHARLIE
                                            </span>
                                            <span className="font-bold text-primary">
                                                {charlieCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm font-semibold">
                                                DELTA
                                            </span>
                                            <span className="font-bold text-primary">
                                                {deltaCount}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        {/* 
  Changed grid-cols to 4 columns on large screens.
  Kept it stacked (grid-cols-1) on mobile devices for responsive design.
*/}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Trainee Activity — Spans 3 out of 4 columns (75% Width) */}
                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>
                                        Recent Trainee Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="overflow-x-auto p-0">
                                    {recentActivity.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-muted-foreground">
                                            No recent return activity recorded.
                                        </p>
                                    ) : (
                                        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-500">
                                            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase">
                                                <tr className="text-center">
                                                    <th className="px-4 py-3">
                                                        Trainee Name
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Mode
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Type
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Duration
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Issued At
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Expires At
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Returned At
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white text-center">
                                                {recentActivity.map(
                                                    (activity) => (
                                                        <tr
                                                            key={activity.id}
                                                            className="transition-colors hover:bg-gray-50/70"
                                                        >
                                                            <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">
                                                                {activity.name}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                                        activity.mode ===
                                                                        'ASHORE'
                                                                            ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
                                                                            : 'bg-green-50 text-green-700 ring-green-700/10'
                                                                    }`}
                                                                >
                                                                    {
                                                                        activity.mode
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`inline-flex items-center rounded-md px-2 py-1 font-mono text-xs font-medium ring-1 ring-inset ${activity.type === 'LIBERTY' ? 'bg-amber-50 text-amber-800 ring-amber-600/10' : activity.type === 'OFFICIAL_BUSINESS' ? 'bg-rose-50 text-rose-700 ring-rose-700/10' : activity.type === 'LEAVE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-700/10' : 'bg-gray-50 text-gray-600 ring-gray-600/10'}`}
                                                                >
                                                                    {
                                                                        activity.type
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {
                                                                    activity.duration
                                                                }{' '}
                                                                {Number(
                                                                    activity.duration,
                                                                ) === 1
                                                                    ? 'Day'
                                                                    : 'Days'}
                                                            </td>
                                                            <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-600">
                                                                {formatTimestamp(
                                                                    activity.issued_at,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-600">
                                                                {formatTimestamp(
                                                                    activity.expires_at,
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-600">
                                                                {formatTimestamp(
                                                                    activity.returned_at,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                                {activity.return_type ===
                                                                'LATE' ? (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="h-[20px] w-[100px] text-[10px] font-semibold"
                                                                    >
                                                                        {activity.late_minutes ??
                                                                            0}{' '}
                                                                        min late
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        className={`h-[20px] w-[100px] justify-center text-[10px] font-semibold ${activity.status === 'ACTIVE' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : activity.status === 'COMPLETED' ? 'bg-blue-600 text-white hover:bg-blue-700' : activity.status === 'EXPIRED' ? 'bg-amber-600 text-white hover:bg-amber-700' : activity.status === 'CANCELLED' ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-400 text-white'}`}
                                                                    >
                                                                        {
                                                                            activity.status
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Pass Summary — Spans the remaining 1 column (25% Width) */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Pass Breakdown (Active Out Ashore)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Liberty
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="px-2.5 font-semibold"
                                        >
                                            {passBreakdown.liberty}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Leave
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="px-2.5 font-semibold"
                                        >
                                            {passBreakdown.leave}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Official Business
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="px-2.5 font-semibold"
                                        >
                                            {passBreakdown.official_business}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
