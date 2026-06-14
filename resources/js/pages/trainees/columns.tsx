'use client';

import { trainees } from '@/routes';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CloudCog, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export type Trainee = {
    id: number;
    name: string;
    birthday: string;
    religion: string;
    contact_no: string;
    email: string;
    status: string;
    address: string;
    emergency_contact_person: string;
    emergency_contact_no: string;
    blood_type: string;
    height: string;
    weight: string;
    identifying_marks: string;
    eye_color: string;
    hair_color: string;
};

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
export const columns: ColumnDef<Trainee>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'contact_no',
        header: 'Contact No',
    },
    {
        accessorKey: 'status',
        header: 'Status',
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
