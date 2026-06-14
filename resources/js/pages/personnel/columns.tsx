'use client';

import { Personnel } from '@/@types/Personnel';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import imageUtility from '@/utils/imageUtility';
import { ColumnDef } from '@tanstack/react-table';
import { AspectRatio } from 'radix-ui';

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

export const columns: ColumnDef<Personnel>[] = [
    {
    accessorKey: 'profile',
    header: 'Profile',
    cell: ({ row }) => (
        <img
            src={imageUtility.getProfile(row.original.profile)}
            alt="Photo"
            className="h-20 w-20 aspect-square rounded-lg object-cover border shadow-sm"
        />
    ),
},
    {
        accessorKey: 'rank',
        header: 'Rank',
         cell: ({ row }) => row.original.rank?.rankCode
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
     {
        accessorKey: 'firstName',
        header: 'First Name',
    },
     {
        accessorKey: 'middleName',
        header: 'Middle Name',
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
                    <div>{row.original.emergencyContactPerson}</div>
                    <div className="text-xs text-gray-500">
                        {row.original.emergencyContactNo}
                    </div>
                </div>
            );
        },
    },
];
