import { Head, Link, router } from '@inertiajs/react';
import { users as UserList, users } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useState } from 'react';

export default function User({ users, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    // ✅ SERVER SEARCH TRIGGER
    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/users',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };
    return (
        <>
            <Head title="Users" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-5">
                        <Input
                            placeholder="Search User..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        {/* <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            className="cursor-pointer"
                            type="button"
                            disabled={processing}
                            onClick={handleButtonClick}
                        >
                            {processing
                                ? 'Processing Import...'
                                : ' Import CSV'}
                        </Button>  */}
                    </div>

                    <Button>
                        <Link href="/create-user">Add User</Link>
                    </Button>
                </div>

                {/* TABLE (NO LOCAL FILTERING) */}
                <DataTable columns={columns} data={users} />

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 pt-4">
                    {users.links.map((link: any, i: number) => (
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

User.layout = {
    breadcrumbs: [
        {
            title: 'Manage Users',
            href: users(),
        },
    ],
};
