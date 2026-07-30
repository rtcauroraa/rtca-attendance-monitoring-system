import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { columns, ActivityLog } from './columns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    logs: {
        data: ActivityLog[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        module?: string;
        user?: string; // Added to match backend payload
    };
}

export default function ActivityLogs({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    // Match fallback logic precisely with what the controller passes back
    const [module, setModule] = useState(filters.module || 'all');
    const [user, setUser] = useState(filters.user || '');

    const handleFilter = () => {
        router.get(
            '/activity-logs',
            {
                search: search || undefined,
                module: module === 'all' ? undefined : module,
                user: user || undefined, // Send user parameter to backend
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setModule('all');
        setUser('');
        router.get(
            '/activity-logs',
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Activity Logs
                </h1>
                <p className="text-sm text-muted-foreground">
                    Monitor application events and system changes.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="max-w-xs"
                />

                {/* Optional User Input Filter */}
                <Input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Filter by user..."
                    className="max-w-xs"
                />

                <Select
                    value={module}
                    onValueChange={(value) => setModule(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Modules" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="trainees">Trainees</SelectItem>
                        <SelectItem value="passes">Passes</SelectItem>
                        <SelectItem value="bypass">Bypass</SelectItem>
                        <SelectItem value="scanning">Scanning</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button onClick={handleFilter}>Filter</Button>
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>

            {/* Shadcn Data Table */}
            <DataTable columns={columns} data={logs.data} />

            {/* Dynamic Shadcn-Styled Pagination Footer */}
            <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium">{logs.from || 0}</span> to{' '}
                    <span className="font-medium">{logs.to || 0}</span> of{' '}
                    <span className="font-medium">{logs.total}</span> logs
                </div>

                <div className="flex justify-center gap-2 pt-4">
                    {logs.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url ?? ''}
                            className={`rounded border px-3 py-1 ${
                                link.active ? 'bg-black text-white' : ''
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
