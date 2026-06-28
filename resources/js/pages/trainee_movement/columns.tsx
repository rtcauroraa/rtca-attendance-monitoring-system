'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TraineeMovement } from '@/@types/TraineeMovement';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

import type {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
/* -----------------------------
   DATE FORMATTER
------------------------------*/
const formatMilitaryDate = (value?: string | Date | null) => {
    if (!value) return '-';

    if (value instanceof Date) {
        const day = value.getDate().toString().padStart(2, '0');
        const month = value.toLocaleString('en-US', { month: 'short' });
        const year = value.getFullYear().toString().slice(-2);
        const hh = value.getHours().toString().padStart(2, '0');
        const mm = value.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year}, ${hh}${mm}H`;
    }

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

/* -----------------------------
   COLUMNS
------------------------------*/
export const columns: ColumnDef<TraineeMovement>[] = [
    {
        id: 'full_name',
        accessorFn: (row) => {
            const t = row.trainee;

            return [
                t?.first_name,
                t?.middle_name,
                t?.last_name,
                t?.suffix && t.suffix !== 'N/A' ? t.suffix : '',
            ]
                .filter(Boolean)
                .join(' ');
        },
        header: 'Name',
        cell: ({ row }) => {
            const t = row.original.trainee;

            const middleInitial = t.middle_name
                ? `${t.middle_name.charAt(0)}.`
                : '';

            const suffix = t.suffix && t.suffix !== 'N/A' ? t.suffix : '';

            return (
                <div className="text-start">
                    <div className="font-medium">
                        {`${t.first_name} ${middleInitial} ${t.last_name} ${suffix}`.trim()}
                    </div>
                    <div className="text-xs text-gray-500">{t.email}</div>
                </div>
            );
        },
        enableColumnFilter: true,
    },

    {
        id: 'serial_number',
        accessorFn: (row) => row.trainee?.serial_number,
        header: 'Serial',
        cell: ({ row }) => row.original.trainee?.serial_number ?? '-',
        enableColumnFilter: true,
    },

    {
        id: 'contact_no',
        accessorFn: (row) => row.trainee?.contact_no,
        header: 'Contact',
        cell: ({ row }) => row.original.trainee?.contact_no ?? '-',
    },

    {
        id: 'coy',
        accessorFn: (row) => row.trainee?.coy,
        header: 'Coy',
        cell: ({ row }) => row.original.trainee?.coy ?? '-',
        enableColumnFilter: true,
    },

    {
        id: 'duration',
        accessorKey: 'duration',
        header: 'Days',
        cell: ({ row }) => row.original.duration ?? '-',
        enableColumnFilter: true,
    },

    {
        id: 'issued_at',
        accessorKey: 'issued_at',
        header: 'Issued',
        cell: ({ row }) => formatMilitaryDate(row.original.issued_at),
    },

    {
        id: 'expires_at',
        accessorKey: 'expires_at',
        header: 'Expires',
        cell: ({ row }) => formatMilitaryDate(row.original.expires_at),
    },

    {
        id: 'returned_at',
        accessorKey: 'returned_at',
        header: 'Aboard',
        cell: ({ row }) => formatMilitaryDate(row.original.returned_at),
    },

    {
        id: 'return_type',
        accessorKey: 'return_type',
        header: 'Return',
        enableColumnFilter: true,
        cell: ({ row }) => {
            const type = row.original.return_type;

            return (
                <div
                    className={`text-center font-semibold uppercase ${
                        type === 'ON_TIME'
                            ? 'text-green-600'
                            : type === 'LATE'
                              ? 'text-red-600'
                              : 'text-gray-400'
                    }`}
                >
                    {type === 'ON_TIME'
                        ? 'ON TIME'
                        : type === 'LATE'
                          ? 'LATE'
                          : '-'}
                </div>
            );
        },
    },

    {
        id: 'late_minutes',
        accessorKey: 'late_minutes',
        header: 'Late',
        cell: ({ row }) =>
            row.original.late_minutes ? `${row.original.late_minutes}m` : '-',
    },

    {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableColumnFilter: true,
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <div
                    className={`text-center font-semibold uppercase ${
                        status === 'ACTIVE'
                            ? 'text-green-600'
                            : status === 'COMPLETED'
                              ? 'text-blue-600'
                              : status === 'EXPIRED'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                    }`}
                >
                    {status}
                </div>
            );
        },
    },
];
