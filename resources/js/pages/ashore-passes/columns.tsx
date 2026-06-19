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
import { AshorePasses } from '@/@types/AshorePasses';

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

// const capitalize = (value: string) =>
//     value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const columns: ColumnDef<AshorePasses>[] = [
    {
        id: 'full_name',
        header: 'Name',
        cell: ({ row }) => {
            return (
                <div>
                    <div>
                        <div>
                            {`${row.original.trainee.first_name} ${
                                row.original.trainee.middle_name
                                    ? row.original.trainee.middle_name.charAt(
                                          0,
                                      ) + '.'
                                    : ''
                            } ${row.original.trainee.last_name} ${row?.original?.trainee.suffix === 'N/A' || !row?.original?.trainee?.suffix ? '' : row?.original?.trainee?.suffix}
`}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.original.trainee.email}
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        cell: ({ row }) => row.original.trainee.serial_number,
    },
    {
        accessorKey: 'coy',
        header: 'Coy',
        cell: ({ row }) => row.original.trainee.coy,
    },
    {
        accessorKey: 'contact_no',
        header: 'Contact No',
        cell: ({ row }) => row.original.trainee.contact_no,
    },

    {
        accessorKey: 'duration_days',
        header: 'Duration (Days)',
        cell: ({ row }) => row.original.duration_days,
    },
    {
        accessorKey: 'issued_at',
        header: 'Passes Issued',
        cell: ({ row }) => row.original.issued_at,
    },
    {
        accessorKey: 'expires_aat',
        header: 'Expires In',
        cell: ({ row }) => row.original.expires_at,
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            return (
                <div
                    className={`text-center font-semibold uppercase ${
                        row.original.status === 'active'
                            ? 'text-green-600'
                            : 'text-red-600'
                    }`}
                >
                    {row.original.status}
                </div>
            );
        },
    },

    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const trainee = row.original.trainee;

            return (
                <div className="flex items-center gap-3 text-center">
                    {/* VIEW DETAILS DIALOG */}
                    {/* EDIT */}
                    <Link
                        href={`trainees/${trainee.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil size={14} />
                    </Link>

                    {/* DELETE */}
                    <button
                        onClick={() => handleDelete(trainee.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            );
        },
    },
];
