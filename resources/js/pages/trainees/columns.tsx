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

    // {
    //     accessorKey: 'id',
    //     header: 'ID',
    // },
    {
        accessorKey: 'id',
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
        cell: ({ row }) => {
            return `${row.original.suffix.toUpperCase()}`;
        },
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
        accessorKey: 'company',
        header: 'Company',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            return `${row.original.status.toUpperCase()}`;
        },
    },
    {
        accessorKey: 'blood_type',
        header: 'Blood Type',
        cell: ({ row }) => {
            return row.original?.blood_type === ''
                ? 'N/A'
                : row.original?.blood_type.toLocaleUpperCase();
        },
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
];
