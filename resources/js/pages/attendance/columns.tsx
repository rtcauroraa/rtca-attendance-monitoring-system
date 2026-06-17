'use client';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export type Attendance = {
    id: number;
    trainee_id: number;
    liberty_status: string;
    reason_for_rejection: string;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<Attendance>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'trainee_id',
        header: 'Trainee_id',
    },
    {
        accessorKey: 'liberty_status',
        header: 'Liberty Status',
    },
    {
        accessorKey: 'Reason For Rejection',
        header: 'reason_for_rejection',
    },
    {
        accessorKey: 'created_at',
        header: 'Date Created',
        cell: ({ row }) => {
            const dateValue = row.getValue('created_at');
            return dateValue
                ? format(new Date(dateValue), 'dd, MMMM yyyy hh:mm a')
                : 'N/A';
        },
    },
];
