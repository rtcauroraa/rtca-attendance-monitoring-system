'use client';

import { trainees } from '@/routes';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CloudCog, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Trainee } from '@/@types/Trainees';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TraineeMovement } from '@/@types/TraineeMovement';

// const handleDelete = (id: number) => {
//     toast.warning('Are you sure you want to delete this trainee record?', {
//         description: 'This action cannot be undone.',
//         position: 'top-center',
//         action: {
//             label: 'Yes',
//             onClick: () => {
//                 router.delete(`/trainees/${id}/delete`, {
//                     onSuccess: () => {
//                         toast.success('Trainee deleted successfully.');
//                     },
//                     onError: () => {
//                         toast.error('Failed to delete trainee.');
//                     },
//                 });
//             },
//         },
//         cancel: { label: 'No', onClick: () => {} },
//     });
// };
const handleDelete = (id: number) => {};

const formatMilitaryDate = (value?: string | Date | null) => {
    if (!value) return '-';

    // If it's a Date object
    if (value instanceof Date) {
        const day = value.getDate().toString().padStart(2, '0');
        const month = value.toLocaleString('en-US', { month: 'short' });
        const year = value.getFullYear().toString().slice(-2);
        const hh = value.getHours().toString().padStart(2, '0');
        const mm = value.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year}, ${hh}${mm}H`;
    }

    // If it's already a formatted string:
    // "21 1937H June 2026"
    const parts = value.split(' ');

    if (parts.length >= 4) {
        const day = parts[0];
        const time = parts[1];
        const month = parts[2].slice(0, 3);
        const year = parts[3].slice(-2);

        return `${day} ${month} ${year}, ${time}`;
    }

    return value;
};

// const capitalize = (value: string) =>
//     value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const columns: ColumnDef<TraineeMovement>[] = [
    {
        accessorKey: 'duration',
        header: 'Days',
        cell: ({ row }) => row.original.duration,
    },

    {
        accessorKey: 'issued_at',
        header: 'Issued',
        cell: ({ row }) => formatMilitaryDate(row.original.issued_at),
    },
    {
        accessorKey: 'expires_at',
        header: 'Expires',
        cell: ({ row }) => formatMilitaryDate(row.original.expires_at),
    },
    {
        accessorKey: 'returned_at',
        header: 'Aboard',
        cell: ({ row }) => formatMilitaryDate(row.original.returned_at),
    },

    {
        accessorKey: 'return_type',
        header: 'Return',
        cell: ({ row }) => (
            <div
                className={`text-center font-semibold uppercase ${
                    row.original.return_type === 'ON_TIME'
                        ? 'text-green-600'
                        : 'text-red-600'
                }`}
            >
                {row.original.return_type === 'ON_TIME'
                    ? 'ON TIME'
                    : row.original.return_type === 'LATE'
                      ? 'LATE'
                      : '-'}
            </div>
        ),
    },
    {
        accessorKey: 'late_minutes',
        header: 'Late',
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.late_minutes
                        ? `${row.original.late_minutes}m`
                        : '-'}
                </div>
            );
        },
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            return (
                <div
                    className={`text-center font-semibold uppercase ${
                        row.original.status === 'ACTIVE'
                            ? 'text-green-600'
                            : row.original.status === 'COMPLETED'
                              ? 'text-blue-600'
                              : row.original.status === 'EXPIRED'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                    }`}
                >
                    {row.original.status}
                </div>
            );
        },
    },
];
