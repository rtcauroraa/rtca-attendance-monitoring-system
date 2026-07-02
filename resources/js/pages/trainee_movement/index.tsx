import { Head, Link, router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
// import { columns } from './columns';
import { trainees, trainees as traineesRoute } from '@/routes';
import { DownloadIcon, Import, Plus, Upload, UploadIcon } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { columns } from './columns';
import * as XLSX from 'xlsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import ManualPassForm from './manual-pass-form';
import { toast } from 'sonner';
export default function Index({ ashorePasses, filters, trainees }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [company, setCompany] = useState(filters?.company || 'all');
    const [isBypassOpen, setIsBypassOpen] = useState(false);
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
    const handleCompanyFilter = (value: string) => {
        setCompany(value);

        router.get(
            '/ashore-passes',
            {
                search,
                company: value,
            },
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

        const date = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `${company || 'all'}-trainee-movement-${date}.xlsx`,
        );
    };
    const fileInputRef = useRef<HTMLInputElement>(null); // Type the ref for TS

    const { data, setData, post, processing, errors, progress } = useForm({
        csv_file: null as File | null, // Type the initial state
    });

    const handleButtonClick = () => {
        // FIX 1: Safe guard against null check
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Update the form state so the UI stays in sync
        setData('csv_file', file);

        // 2. Pass the fresh file directly into the post option overrides
        //    so Inertia gets it instantly without waiting for React to re-render.
        post('/import-trainees/passes/', {
            forceFormData: true,
            onSuccess: () => {
                setData('csv_file', null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clean up input element
                }
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };
    return (
        <>
            <Head title="Ashore Passes" />
            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex w-full flex-col gap-4">
                    {/* HIDDEN FILE INPUT */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv, text/plain"
                        className="hidden"
                        disabled={processing}
                    />

                    {/* RESPONSIVE BAR CONTAINER */}
                    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* LEFT / PRIMARY CONTROLS (Search & Filter) */}
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:max-w-xl">
                            <Input
                                placeholder="Search Passes..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full"
                            />

                            <Select
                                value={company || 'all'}
                                onValueChange={handleCompanyFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Companies" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Companies
                                    </SelectItem>
                                    <SelectItem value="Alpha">Alpha</SelectItem>
                                    <SelectItem value="Bravo">Bravo</SelectItem>
                                    <SelectItem value="Charlie">
                                        Charlie
                                    </SelectItem>
                                    <SelectItem value="Delta">Delta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* RIGHT / ACTION BUTTONS */}
                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:items-center md:w-auto">
                            <Button
                                className="w-full border text-primary sm:w-auto"
                                type="button"
                                onClick={exportExcel}
                                variant="ghost"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <DownloadIcon className="h-4 w-4 shrink-0" />
                                    <span>Export</span>
                                </div>
                            </Button>

                            <Button
                                className="w-full sm:w-auto"
                                type="button"
                                disabled={processing}
                                onClick={handleButtonClick}
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Upload className="h-4 w-4 shrink-0" />
                                        <span>Upload CSV</span>
                                    </div>
                                )}
                            </Button>

                            {/* MANUAL BYPASS BUTTON & DIALOG */}
                            <Dialog
                                open={isBypassOpen}
                                onOpenChange={setIsBypassOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="col-span-2 w-full sm:col-span-1 sm:w-auto"
                                    >
                                        Manual Bypass
                                    </Button>
                                </DialogTrigger>

                                <DialogContent
                                    className="w-[95vw] justify-center rounded-lg sm:max-w-[500px]"
                                    onPointerDownOutside={(e) =>
                                        e.preventDefault()
                                    }
                                    onInteractOutside={(e) =>
                                        e.preventDefault()
                                    }
                                >
                                    <DialogHeader>
                                        <DialogTitle>
                                            Gate Pass Manual Bypass
                                        </DialogTitle>
                                        <DialogDescription>
                                            Override QR scanner controls for a
                                            trainee. This action will be logged.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <ManualPassForm
                                        trainees={trainees}
                                        onSuccessClose={() =>
                                            setIsBypassOpen(false)
                                        }
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
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
