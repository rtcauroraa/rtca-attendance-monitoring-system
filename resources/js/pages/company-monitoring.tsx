import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
const companyData = {
    ALL: {
        total: 200,
        onboard: 175,
        ashore: 12,
        liberty: 8,
        leave: 5,
        overdue: 2,
    },
    ALPHA: {
        total: 50,
        onboard: 45,
        ashore: 2,
        liberty: 2,
        leave: 1,
        overdue: 0,
    },
    BRAVO: {
        total: 50,
        onboard: 42,
        ashore: 4,
        liberty: 2,
        leave: 2,
        overdue: 1,
    },
    CHARLIE: {
        total: 50,
        onboard: 44,
        ashore: 3,
        liberty: 2,
        leave: 1,
        overdue: 0,
    },
    DELTA: {
        total: 50,
        onboard: 44,
        ashore: 3,
        liberty: 2,
        leave: 1,
        overdue: 1,
    },
};

const activities = [
    {
        id: 1,
        company: 'ALPHA',
        trainee: 'Juan Cruz',
        action: 'Returned',
        time: '0905H',
    },
    {
        id: 2,
        company: 'BRAVO',
        trainee: 'Pedro Santos',
        action: 'Ashore',
        time: '0850H',
    },
    {
        id: 3,
        company: 'DELTA',
        trainee: 'Mark Reyes',
        action: 'Liberty',
        time: '0845H',
    },
    {
        id: 4,
        company: 'CHARLIE',
        trainee: 'Carl Ramos',
        action: 'Returned',
        time: '0830H',
    },
];

export default function CompanyMonitoring() {
    const [company, setCompany] = useState<keyof typeof companyData>('ALL');
    const filteredActivities =
        company === 'ALL'
            ? activities
            : activities.filter((activity) => activity.company === company);
    const stats = companyData[company];

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Company Monitoring</h1>
                    <p className="text-muted-foreground">
                        Monitor trainee status per company
                    </p>
                </div>

                <Select
                    value={company}
                    onValueChange={(value) =>
                        setCompany(value as keyof typeof companyData)
                    }
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="ALL">All Companies</SelectItem>
                        <SelectItem value="ALPHA">Alpha Company</SelectItem>
                        <SelectItem value="BRAVO">Bravo Company</SelectItem>
                        <SelectItem value="CHARLIE">Charlie Company</SelectItem>
                        <SelectItem value="DELTA">Delta Company</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Dashboard Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Onboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {stats.onboard}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ashore</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                            {stats.ashore}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liberty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {stats.liberty}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                            {stats.leave}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            {stats.overdue}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Company Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {company === 'ALL'
                            ? 'All Companies Overview'
                            : `${company} Company Overview`}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="mb-2 flex justify-between text-sm">
                                <span>Onboard Percentage</span>
                                <span>
                                    {Math.round(
                                        (stats.onboard / stats.total) * 100,
                                    )}
                                    %
                                </span>
                            </div>

                            <div className="h-3 w-full rounded bg-muted">
                                <div
                                    className="h-3 rounded bg-green-500"
                                    style={{
                                        width: `${
                                            (stats.onboard / stats.total) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between border-b pb-2"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {activity.trainee}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {activity.company}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium">
                                            {activity.action}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No activity found.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
