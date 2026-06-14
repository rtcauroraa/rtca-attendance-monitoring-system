'use client';

import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { ColumnDef } from '@tanstack/react-table';

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
            return formatDateToMilitary( row.original.birthday)
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
