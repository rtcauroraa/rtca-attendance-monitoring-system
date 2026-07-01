import { Head, Link, router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { trainees as traineesRoute } from '@/routes';
import {
    DownloadCloud,
    DownloadIcon,
    Import,
    Plus,
    Upload,
    UploadIcon,
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
export default function Trainee({ trainees, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [company, setCompany] = useState(filters?.company || 'all');
    // ✅ SERVER SEARCH TRIGGER
    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/trainees',
            {
                search: value,
                company: company,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleCompanyFilter = (value: string) => {
        setCompany(value);

        router.get(
            '/trainees',
            {
                search: search,
                company: value,
            },
            {
                preserveState: true,
                replace: true,
            },
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

        setData('csv_file', file);

        post('/import-trainees', {
            forceFormData: true,
            onSuccess: () => {
                setData('csv_file', null);
                e.target.value = '';
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const downloadQrPdf = () => {
        const params = new URLSearchParams();

        if (company && company !== 'all') {
            params.append('company', company);
        }

        window.open(`/trainees/qr-pdf?${params.toString()}`, '_blank');
    };
    return (
        <>
            <Head title="Trainees" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-5">
                        <Input
                            placeholder="Search Trainee..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <Select
                            value={company || 'all'}
                            onValueChange={handleCompanyFilter}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Companies" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All Companies
                                </SelectItem>

                                <SelectItem value="Alpha">Alpha</SelectItem>
                                <SelectItem value="Bravo">Bravo</SelectItem>
                                <SelectItem value="Charlie">Charlie</SelectItem>
                                <SelectItem value="Delta">Delta</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="cursor-pointer"
                            type="button"
                            disabled={processing}
                            onClick={handleButtonClick}
                        >
                            {processing ? (
                                'Processing Import...'
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Import CSV
                                    </span>
                                </div>
                            )}
                        </Button>
                        <Button
                            className="cursor-pointer border text-primary"
                            type="button"
                            onClick={downloadQrPdf}
                            variant="ghost"
                        >
                            <div className="flex items-center gap-2">
                                <DownloadIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Download QR Code
                                </span>
                            </div>
                        </Button>
                    </div>

                    <Button asChild>
                        <Link
                            href="/create-trainee"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Add Trainee
                            </span>
                        </Link>
                    </Button>
                </div>

                {/* TABLE (NO LOCAL FILTERING) */}
                <DataTable columns={columns} data={trainees.data} />

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 pt-4">
                    {trainees.links.map((link: any, i: number) => (
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

Trainee.layout = {
    breadcrumbs: [
        {
            title: 'Trainees',
            href: traineesRoute(),
        },
    ],
};
