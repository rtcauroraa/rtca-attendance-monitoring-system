import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard, user } from '@/routes';
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { Button } from '@/components/ui/button';

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ]
}

const data = await getData()
export default function User() {
    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 px-10">
                <div className="flex justify-between">
                    <div>Left Side (Logo)</div>
                    <div>
                        <Button variant="outline" className='cursor-pointer' ><Link href="/create-user">Add User</Link></Button>
                    </div>
                </div>
                <div className="grid auto-rows-min ">

                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </>
    );
}

User.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: user(),
        },
    ],
};


