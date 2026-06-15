'use client';

import { trainees } from '@/routes';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CloudCog, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Trainee } from '@/types/interface';

const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this trainee record?', {
        description: 'This action cannot be undone.',
        position: 'top-center',
        action: {
            label: 'Yes',
            onClick: () => {
                router.delete(`/trainees/${id}/delete`, {
                    onSuccess: () => {
                        toast.success('Trainee deleted successfully.');
                    },
                    onError: () => {
                        toast.error('Failed to delete trainee.');
                    },
                });
            },
        },
        cancel: { label: 'No', onClick: () => {} },
    });
};
const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
export const columns: ColumnDef<Trainee>[] = [
    {
        id: 'full_name',
        header: 'Name',
        cell: ({ row }) => {
            return (
                <div>
                    <div>
                        <div>
                            {`${row.original.first_name} ${
                                row.original.middle_name
                                    ? row.original.middle_name.charAt(0) + '.'
                                    : ''
                            } ${row.original.last_name} ${row?.original?.suffix === 'N/A' || !row?.original?.suffix ? '' : row.original.suffix}
`}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.original.email}
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: 'contact_no',
        header: 'Contact No',
    },
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        cell: ({ row }) => capitalize(row.original.serial_number),
    },
    {
        accessorKey: 'coy',
        header: 'Coy',
    },
    {
        accessorKey: 'blood_type',
        header: 'Blood Type',
    },
    {
        accessorKey: 'birthday',
        header: 'Birthday',
        cell: ({ row }) => {
            return formatDateToMilitary(row.original.birthday);
        },
    },
    {
        id: 'physical',
        header: 'Physical',
        cell: ({ row }) => {
            return `${row.original.height} cm / ${row.original.weight} kg`;
        },
    },
    {
        id: 'emergency',
        header: 'Emergency Contact',
        cell: ({ row }) => {
            return (
                <div>
                    <div>{row.original.emergency_contact_person}</div>
                    <div className="text-xs text-gray-500">
                        {row.original.emergency_contact_no}
                    </div>
                </div>
            );
        },
    },

    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3">
                    <Link
                        href={`trainees/${row.original.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                    >
                        <EyeIcon size={14} />
                    </Link>
                    <Link
                        href={`trainees/${row.original.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil size={14} />
                    </Link>
                    <Link
                        onClick={() => handleDelete(row.original.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={14} />
                    </Link>
                </div>
            );
        },
    },
];
