'use client';

import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { ColumnDef } from '@tanstack/react-table';

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
        accessorKey: 'Liberty Status',
        header: 'liberty_status',
    },
    {
        accessorKey: 'reason_for_rejection',
        header: 'Reason For Rejection',
    },
];
