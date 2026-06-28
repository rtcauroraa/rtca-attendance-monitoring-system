'use client';

import { user } from '@/routes';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CloudCog, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
// import { format } from 'date-fns';

export type User = {
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
    toast.warning('Are you sure you want to delete this user record?', {
        description: 'This action cannot be undone.',
        position: 'top-center',
        action: {
            label: 'Yes',
            onClick: () => {
                router.delete(`/users/${id}`, {
                    onSuccess: () => {
                        toast.success('User deleted successfully.');
                    },
                    onError: () => {
                        toast.error('Failed to delete user.');
                    },
                });
            },
        },
        cancel: { label: 'No', onClick: () => {} },
    });
};
export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },

    {
        accessorKey: 'created_at',
        header: 'Date Created',
        cell: ({ row }) => {
            const dateValue = row.getValue('created_at');
            // return dateValue
            //     ? format(new Date(dateValue), 'dd, MMMM yyyy hh:mm a')
            //     : 'N/A';
        },
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3">
                    <Link
                        href={`users/${row.original.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                    >
                        <EyeIcon size={14} />
                    </Link>
                    <Link
                        href={`users/${row.original.id}/edit`}
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
