import { ColumnDef } from '@tanstack/react-table';

// Define the type matching your Spatie activity log structure
export type ActivityLog = {
    id: number;
    description: string;
    log_name: string;
    created_at: string;
    causer?: {
        name: string;
    } | null;
};

export const columns: ColumnDef<ActivityLog>[] = [
    {
        accessorKey: 'causer.name',
        header: 'User',
        cell: ({ row }) => row.original.causer?.name || 'System',
    },
    {
        accessorKey: 'description',
        header: 'Action',
    },
    {
        accessorKey: 'log_name',
        header: 'Module',
        cell: ({ row }) => (
            <span className="capitalize">{row.original.log_name}</span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
];
