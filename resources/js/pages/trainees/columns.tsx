'use client';

import { trainees } from '@/routes';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CloudCog, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Trainee } from '@/@types/Trainees';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this trainee record?', {
        description: 'This action cannot be undone.',
        position: 'top-center',
        action: {
            label: 'Yes',
            onClick: () => {
                router.delete(`/trainees/${id}/delete`, {
                    onSuccess: () => {
                        toast.success('Trainee deleted successfully.', {
                            position: 'top-center',
                            style: {
                                '--normal-bg':
                                    'light-dark(var(--color-green-600), var(--color-green-400))',
                                '--normal-text': 'var(--color-white)',
                                '--normal-border':
                                    'light-dark(var(--color-green-600), var(--color-green-400))',
                            } as React.CSSProperties,
                        });
                    },
                    onError: (error) => {
                        toast.error(error.error, {
                            position: 'top-center',
                            style: {
                                '--normal-bg':
                                    'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                                '--normal-text': 'var(--color-white)',
                                '--normal-border': 'transparent',
                            } as React.CSSProperties,
                        });
                    },
                });
            },
        },
        cancel: { label: 'No', onClick: () => {} },
    });
};

export const columns = (
    currentPage: number,
    pageSize: number,
): ColumnDef<Trainee>[] => [
    {
        id: 'number',
        header: () => <div>No.</div>,
        cell: ({ row }) => {
            return (currentPage - 1) * pageSize + row.index + 1;
        },
    },

    {
        accessorKey: 'qr_code',
        header: ({ column }) => <div>QR Code</div>,
        cell: ({ row }) => {
            const file = row.getValue('qr_code') as string;
            return (
                <div className="flex items-center justify-center">
                    <img
                        src={`/storage/${file}`}
                        alt="QR Code"
                        className="h-13 w-13 object-contain"
                    />
                </div>
            );
        },
    },
    {
        id: 'full_name',
        header: 'Full Name',
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <div>
                        {row.original.first_name
                            ?.toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()) ??
                            'N/A'}{' '}
                        {row.original.middle_name.charAt(0)}{' '}
                        {row.original.last_name
                            ?.toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()) ??
                            'N/A'}
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
        cell: ({ row }) => row.original.contact_no?.trim() || 'N/A',
    },
    {
        accessorKey: 'serial_number',
        header: ({ column }) => <div>Serial Number</div>,
    },
    {
        accessorKey: 'coy',
        header: 'Company',
    },
    {
        accessorKey: 'blood_type',
        header: 'Blood Type',
        cell: ({ row }) => row?.original.blood_type || 'N/A',
    },
    {
        accessorKey: 'birthday',
        header: 'Birthday',
        cell: ({ row }) => row?.original.birthday || 'N/A',
    },
    {
        id: 'physical',
        header: ({ column }) => <div>Physical</div>,
        cell: ({ row }) => {
            return `${row.original.height} cm / ${row.original.weight} kg`;
        },
    },
    {
        id: 'emergency',
        header: ({ column }) => <div>Emergency Contact</div>,
        cell: ({ row }) => {
            return (
                <div>
                    <div>
                        {row.original.emergency_contact_person
                            ?.toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()) ??
                            'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.original.emergency_contact_no || 'N/A'}
                    </div>
                </div>
            );
        },
    },

    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const trainee = row.original;

            return (
                <div className="flex items-center gap-3">
                    {/* VIEW DETAILS DIALOG */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="cursor-pointer text-green-600 hover:text-black">
                                <Eye size={16} />
                            </button>
                        </DialogTrigger>

                        <DialogContent
                            onOpenAutoFocus={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById('dialog-title-focus')
                                    ?.focus();
                            }}
                            className="max-h-[90dvh] max-w-[90vw] overflow-y-auto sm:max-w-[800px]"
                        >
                            <DialogHeader>
                                <DialogTitle>Trainee Details</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center border-t pt-4">
                                {trainee.qr_code ? (
                                    <img
                                        src={`/storage/${trainee.qr_code}`}
                                        alt="QR Code"
                                        className="h-40 w-40 rounded border p-2"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No QR code available
                                    </p>
                                )}
                            </div>
                            {/* DETAILS */}

                            <div
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                id="dialog-title-focus"
                                tabIndex={-1}
                            >
                                <div>
                                    <label className="text-xs text-gray-500">
                                        Full Name
                                    </label>
                                    <input
                                        readOnly
                                        value={`${trainee.first_name} ${trainee.middle_name ?? ''} ${trainee.last_name} ${trainee.suffix && trainee.suffix !== 'N/A' ? trainee.suffix : ''}`}
                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                    />
                                </div>
                                {/* SERIAL NUMBER */}
                                <div>
                                    <label className="text-xs text-gray-500">
                                        Email
                                    </label>
                                    <input
                                        readOnly
                                        value={trainee.email ?? ''}
                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 text-sm">
                                {/* NAME */}

                                {/* EMAIL */}

                                {/* SERIAL NUMBER */}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Company Coy
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.coy ?? ''}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    {/* SERIAL NUMBER */}
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Serial Number
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.serial_number ?? ''}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Religion
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.religion ?? ''}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    {/* SERIAL NUMBER */}
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Marital Status
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.status ?? ''}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Contact Number
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.contact_no ?? ''}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>

                                    {/* BIRTHDAY */}
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Birthday
                                        </label>
                                        <input
                                            readOnly
                                            value={formatDateToMilitary(
                                                trainee.birthday,
                                            )}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Emergency Contact Person
                                        </label>
                                        <input
                                            readOnly
                                            value={
                                                trainee.emergency_contact_person
                                                    ?.toLowerCase()
                                                    .replace(/\b\w/g, (char) =>
                                                        char.toUpperCase(),
                                                    ) ?? 'N/A'
                                            }
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Emergeny Contact Number
                                        </label>
                                        <input
                                            readOnly
                                            value={
                                                trainee?.emergency_contact_no ||
                                                'N/A'
                                            }
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Height
                                        </label>
                                        <input
                                            readOnly
                                            value={`${trainee.height} cm`}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    {/* BIRTHDAY */}
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Weight
                                        </label>
                                        <input
                                            readOnly
                                            value={`${trainee.weight} kg`}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Blood Type
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.blood_type}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Eye Color
                                        </label>
                                        <input
                                            readOnly
                                            value={`${trainee.eye_color}`}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    {/* BIRTHDAY */}
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Hair Color
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.hair_color}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Identifying Marks
                                        </label>
                                        <input
                                            readOnly
                                            value={trainee.identifying_marks}
                                            className="w-full overflow-x-auto rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500">
                                        Address
                                    </label>
                                    <input
                                        readOnly
                                        value={trainee.address}
                                        className="w-full overflow-x-auto rounded border bg-gray-100 px-3 py-2"
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* EDIT */}
                    <Link
                        href={`trainees/${trainee.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil size={14} />
                    </Link>

                    {/* DELETE */}
                    <button
                        onClick={() => handleDelete(trainee.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            );
        },
    },
];
