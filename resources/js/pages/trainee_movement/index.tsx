import { Head, Link, router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
// import { columns } from './columns';
import { trainees as traineesRoute } from '@/routes';
import { Import, Plus, Upload, UploadIcon } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { columns } from './columns';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
export default function Index({ ashorePasses, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/ashore-passes',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // EXPORT EXCEL
    const exportExcel = () => {
        const dataToExport = ashorePasses.data;

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, 'trainee-movement.xlsx');
    };
    return (
        <>
            <Head title="Ashore Passes" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-5">
                        <Input
                            placeholder="Search Passes..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    {/* <Button asChild>
                        <Link
                            href="/create-trainee"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Add Trainee
                            </span>
                        </Link>
                    </Button> */}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={exportExcel}
                        className="rounded border px-3 py-1"
                    >
                        Export Excel
                    </button>
                </div>

                {/* TABLE (NO LOCAL FILTERING) */}
                <DataTable
                    columns={columns}
                    data={ashorePasses.data}
                    globalFilter={search}
                    setGlobalFilter={setSearch}
                />

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 pt-4">
                    {ashorePasses.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url ?? ''}
                            className={`rounded border px-3 py-1 ${
                                link.active ? 'bg-[#173796] text-white' : ''
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

// Trainee.layout = {
//     breadcrumbs: [
//         {
//             title: 'Trainees',
//             href: traineesRoute(),
//         },
//     ],
// };
