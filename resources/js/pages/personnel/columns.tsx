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
        // cell: ({ row }) => (
        //     <img
        //         src={imageUtility.getProfile(row.original.profile)}
        //         alt="Photo"
        //         className="h-20 w-20 aspect-square rounded-lg object-cover border shadow-sm"
        //     />
        // ),
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
        accessorKey: 'status',
        header: 'Status',
    },
];
