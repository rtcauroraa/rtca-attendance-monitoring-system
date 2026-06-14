import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { attendance as attendancesRoute } from '@/routes';

export default function attendance({ attendanceattendances, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    // ✅ SERVER SEARCH TRIGGER
    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/attendanceattendances',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="attendances" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <Input
                        placeholder="Search attendanceattendances..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-sm"
                    />

                    <Button>
                        <Link href="/create-attendanceattendance">
                            Add attendance
                        </Link>
                    </Button>
                </div>

                {/* TABLE (NO LOCAL FILTERING) */}
                <DataTable
                    columns={columns}
                    data={attendanceattendances.data}
                />

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 pt-4">
                    {attendanceattendances.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url ?? ''}
                            className={`rounded border px-3 py-1 ${
                                link.active ? 'bg-black text-white' : ''
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

attendance.layout = {
    breadcrumbs: [
        {
            title: 'attendances',
            href: attendancesRoute(),
        },
    ],
};
