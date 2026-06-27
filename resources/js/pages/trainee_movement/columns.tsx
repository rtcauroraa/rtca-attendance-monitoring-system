'use client';

import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { TraineeMovement } from '@/@types/TraineeMovement';

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
const formatMilitaryDate = (value?: string | Date | null) => {
    if (!value) return '-';

    // If it's a Date object
    if (value instanceof Date) {
        const day = value.getDate().toString().padStart(2, '0');
        const month = value.toLocaleString('en-US', { month: 'short' });
        const year = value.getFullYear().toString().slice(-2);
        const hh = value.getHours().toString().padStart(2, '0');
        const mm = value.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year}, ${hh}${mm}H`;
    }

    // If it's already a formatted string:
    // "21 1937H June 2026"
    const parts = value.split(' ');

    if (parts.length >= 4) {
        const day = parts[0];
        const time = parts[1];
        const month = parts[2].slice(0, 3);
        const year = parts[3].slice(-2);

        return `${day} ${month} ${year}, ${time}`;
    }

    return value;
};

export const columns: ColumnDef<TraineeMovement>[] = [
    {
        id: 'full_name',
        header: () => <div className="text-start">Name</div>,
        cell: ({ row }) => {
            return (
                <div className="text-start">
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
        header: 'Serial',
        cell: ({ row }) => row.original.trainee.serial_number,
    },
    {
        accessorKey: 'contact_no',
        header: 'Contact',
        cell: ({ row }) => row.original.trainee.contact_no,
    },
    {
        accessorKey: 'coy',
        header: 'Coy',
        cell: ({ row }) => row.original.trainee.coy,
    },

    {
        accessorKey: 'duration',
        header: 'Days',
        cell: ({ row }) => row.original.duration,
    },

    {
        accessorKey: 'issued_at',
        header: 'Issued',
        cell: ({ row }) => formatMilitaryDate(row.original.issued_at),
    },
    {
        accessorKey: 'expires_at',
        header: 'Expires',
        cell: ({ row }) => formatMilitaryDate(row.original.expires_at),
    },
    {
        accessorKey: 'returned_at',
        header: 'Aboard',
        cell: ({ row }) => formatMilitaryDate(row.original.returned_at),
    },

    {
        accessorKey: 'return_type',
        header: 'Return',
        cell: ({ row }) => (
            <div
                className={`text-center font-semibold uppercase ${
                    row.original.return_type === 'ON_TIME'
                        ? 'text-green-600'
                        : 'text-red-600'
                }`}
            >
                {row.original.return_type === 'ON_TIME'
                    ? 'ON TIME'
                    : row.original.return_type === 'LATE'
                      ? 'LATE'
                      : '-'}
            </div>
        ),
    },

    {
        accessorKey: 'late_minutes',
        header: 'Late',
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.late_minutes
                        ? `${row.original.late_minutes}m`
                        : '-'}
                </div>
            );
        },
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            return (
                <div
                    className={`text-center font-semibold uppercase ${
                        row.original.status === 'ACTIVE'
                            ? 'text-green-600'
                            : row.original.status === 'COMPLETED'
                              ? 'text-blue-600'
                              : row.original.status === 'EXPIRED'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                    }`}
                >
                    {row.original.status}
                </div>
            );
        },
    },

    // {
    //     id: 'action',
    //     header: 'Action',
    //     cell: ({ row }) => {
    //         const trainee = row.original.trainee;

    //         return (
    //             <div className="flex items-center gap-3 text-center">
    //                 {/* VIEW DETAILS DIALOG */}
    //                 {/* EDIT */}
    //                 <Link
    //                     href={`trainees/${trainee.id}/edit`}
    //                     className="text-blue-600 hover:text-blue-800"
    //                 >
    //                     <Penc size={14} />
    //                 </Link>

    //                 {/* DELETE */}
    //                 <button
    //                     onClick={() => handleDelete(trainee.id)}
    //                     className="text-red-600 hover:text-red-800"
    //                 >
    //                     <Trash2 size={14} />
    //                 </button>
    //             </div>
    //         );
    //     },
    // },
];
