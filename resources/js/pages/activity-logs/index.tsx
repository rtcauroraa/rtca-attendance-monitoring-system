import { useState } from 'react';
import { router } from '@inertiajs/react';
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

interface Props {
    logs: {
        data: ActivityLog[];
        // If you have pagination links, they will be here (e.g. links: [])
    };
    filters: {
        search?: string;
        module?: string;
    };
}

export default function ActivityLogs({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [module, setModule] = useState(filters.module || 'all');

    const handleFilter = () => {
        router.get(
            '/activity-logs',
            {
                search: search || undefined,
                module: module === 'all' ? undefined : module,
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

            {/* Shadcn Styled Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs..."
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
                        {/* <SelectItem value="import">Import</SelectItem>
                        <SelectItem value="download">Download</SelectItem> */}
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
        </div>
    );
}
