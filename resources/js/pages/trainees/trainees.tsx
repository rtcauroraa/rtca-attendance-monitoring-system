import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { trainees as traineesRoute } from '@/routes';

export default function Trainee({ trainees, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    // ✅ SERVER SEARCH TRIGGER
    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/trainees',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Trainees" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <Input
                        placeholder="Search trainees..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-sm"
                    />

                    <Button>
                        <Link href="/create-trainee">Add Trainee</Link>
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

Trainee.layout = {
    breadcrumbs: [
        {
            title: 'Trainees',
            href: traineesRoute(),
        },
    ],
};
