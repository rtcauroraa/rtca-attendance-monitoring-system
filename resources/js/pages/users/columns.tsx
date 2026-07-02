'use client';

import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
    created_at: string; // Added to match backend timestamp
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
            const dateValue = row.getValue('created_at') as string;

            if (!dateValue) return 'N/A';

            // Formats to: "Jan 15, 2026, 10:30 AM" (Clever, clean, native JS)
            return new Date(dateValue).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        },
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href={`users/${row.original.id}`} // Typically view is just the resource path
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
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault(); //
                            handleDelete(row.original.id);
                        }}
                        className="cursor-pointer border-none bg-transparent p-0 text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            );
        },
    },
];
