import { Head, Link, router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DownloadIcon, Plus, Upload, UploadIcon } from 'lucide-react';
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
    // --- 1. SETUP DECLARED STATES FROM PROPS ---
    const [search, setSearch] = useState(filters?.search || '');
    const [company, setCompany] = useState(filters?.company || 'all');
    const [mode, setMode] = useState(filters?.mode || 'all');
    const [type, setType] = useState(filters?.type || 'all');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [returnType, setReturnType] = useState(filters?.return_type || 'all');
    const [isBypassOpen, setIsBypassOpen] = useState(false);

    // --- 2. UNIFIED FILTER HANDLER LOGIC ---
    const applyFilters = (updated: Record<string, string>) => {
        const payload = {
            search: updated.search !== undefined ? updated.search : search,
            company: updated.company !== undefined ? updated.company : company,
            mode: updated.mode !== undefined ? updated.mode : mode,
            type: updated.type !== undefined ? updated.type : type,
            status: updated.status !== undefined ? updated.status : status,
            return_type:
                updated.returnType !== undefined
                    ? updated.returnType
                    : returnType,
        };

        // Convert 'all' selections to undefined so they drop clean off the query string
        const cleanedPayload = Object.fromEntries(
            Object.entries(payload).map(([key, val]) => [
                key,
                val === 'all' || !val ? undefined : val,
            ]),
        );

        router.get('/ashore-passes', cleanedPayload, {
            preserveState: true,
            replace: true,
        });
    };

    // --- 3. EXPLICIT DROPDOWN EVENT HOOKS ---
    const handleSearch = (value: string) => {
        setSearch(value);
        applyFilters({ search: value });
    };

    const handleCompanyFilter = (value: string) => {
        setCompany(value);
        applyFilters({ company: value });
    };

    const handleModeFilter = (value: string) => {
        setMode(value);
        applyFilters({ mode: value });
    };

    const handleTypeFilter = (value: string) => {
        setType(value);
        applyFilters({ type: value });
    };

    const handleStatusFilter = (value: string) => {
        setStatus(value);
        applyFilters({ status: value });
    };

    const handleReturnTypeFilter = (value: string) => {
        setReturnType(value);
        applyFilters({ returnType: value });
    };

    // EXPORT EXCEL
    const exportExcel = () => {
        // 1. Get your raw data array
        const rawData = ashorePasses.data || [];

        // 2. Map through and pull data from both the root and the nested trainee object
        const dataToExport = rawData.map((item: any) => {
            // Pull the nested trainee object out of the pass item,
            // and ignore the root-level timestamp fields
            const {
                id,
                created_at,
                updated_at,
                trainee,
                trainee_id,
                ...passDetails
            } = item;

            return {
                'Serial Number': trainee?.serial_number || 'N/A',
                'First Name': trainee?.first_name?.trim() || '',
                'Last Name': trainee?.last_name?.trim() || '',
                Company: trainee?.coy || '',
                ...passDetails, // Spreads out: duration, expires_at, issued_at, mode, status, etc.
            };
        });

        // 3. Pass the cleaned data to XLSX
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const date = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(
            workbook,
            `${company || 'all'}-trainee-movement-${date}.xlsx`,
        );
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, progress } = useForm({
        csv_file: null as File | null,
    });

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('csv_file', file);
        post('/import-trainees/passes/', {
            forceFormData: true,
            onSuccess: () => {
                setData('csv_file', null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                toast.success('All records imported successfully!', {
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

            onError: (errors) => {
                const messages = errors.csv_file ?? errors.error ?? [];

                if (Array.isArray(messages)) {
                    messages.forEach((message) => {
                        toast.error(message, {
                            position: 'top-center',
                            style: {
                                '--normal-bg':
                                    'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                                '--normal-text': 'var(--color-white)',
                                '--normal-border': 'transparent',
                            } as React.CSSProperties,
                        });
                    });
                } else {
                    toast.error(messages || 'Import failed.', {
                        position: 'top-center',
                        style: {
                            '--normal-bg':
                                'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                            '--normal-text': 'var(--color-white)',
                            '--normal-border': 'transparent',
                        } as React.CSSProperties,
                    });
                }
            },
        });
    };

    return (
        <>
            <Head title="Ashore Passes" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex w-full flex-col gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv, text/plain"
                        className="hidden"
                        disabled={processing}
                    />

                    {/* RESPONSIVE BAR CONTAINER */}
                    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        {/* LEFT CONTROLS (Filters) */}
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:max-w-4xl lg:grid-cols-5">
                            <Input
                                placeholder="Search Passes..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full"
                            />

                            <Select
                                value={company}
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

                            <Select
                                value={type}
                                onValueChange={handleTypeFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="LIBERTY">
                                        Liberty
                                    </SelectItem>
                                    <SelectItem value="LEAVE">Leave</SelectItem>
                                    <SelectItem value="OFFICIAL_BUSINESS">
                                        Official Business
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={status}
                                onValueChange={handleStatusFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="ACTIVE">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="COMPLETED">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="EXPIRED">
                                        Expired
                                    </SelectItem>
                                    <SelectItem value="CANCELED">
                                        Canceled
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={returnType}
                                onValueChange={handleReturnTypeFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Return Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Return Types
                                    </SelectItem>
                                    <SelectItem value="LATE">Late</SelectItem>
                                    <SelectItem value="ON_TIME">
                                        On Time
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* RIGHT CONTROLS (Action Buttons - Pushed to the right with space in between) */}
                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:items-center lg:w-auto lg:shrink-0">
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
                {/* TABLE */}
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
                            preserveState
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
