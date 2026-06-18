'use client';

import { Personnel } from '@/@types/Personnel';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import imageUtility from '@/utils/imageUtility';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { AspectRatio } from 'radix-ui';
import { toast } from 'sonner';

// export type Personnel = {
//     id: number;
//     name: string;
//     birthday: string;
//     religion: string;
//     contact_no: string;
//     email: string;
//     status: string;
//     address: string;
//     emergency_contact_person: string;
//     emergency_contact_no: string;
//     blood_type: string;
//     height: string;
//     weight: string;
//     identifying_marks: string;
//     eye_color: string;
//     hair_color: string;
// };

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
export const columns: ColumnDef<Personnel>[] = [
    {
        accessorKey: 'profile',
        header: 'Profile',
        cell: ({ row }) => (
            <img
                // src={imageUtility.getProfile(row.original.profile)}
                src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                alt="Photo"
                className="aspect-square h-20 w-20 rounded-lg border object-cover shadow-sm"
            />
        ),
    },
    {
        accessorKey: 'rank',
        header: 'Rank',
        // cell: ({ row }) => row.original.rank?.rankCode,
    },
    {
        accessorKey: 'lastname',
        header: 'Last Name',
    },
    {
        accessorKey: 'firstname',
        header: 'First Name',
    },
    {
        accessorKey: 'middlename',
        header: 'Middle Name',
    },
    {
        accessorKey: 'suffix',
        header: 'Suffix',
    },
    {
        accessorKey: 'serialno',
        header: 'Serial No',
        cell: ({ row }) => `${row.original.serialno} PCG`,
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
            return dateValue
                ? format(new Date(dateValue), 'dd, MMMM yyyy hh:mm a')
                : 'N/A';
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
