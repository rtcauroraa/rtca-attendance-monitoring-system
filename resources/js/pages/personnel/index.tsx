import { DataTable } from '@/components/ui/data-table';
import PersonnelService from '@/services/personnel-service';
import { Head, Link, router } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { personnel } from '@/routes';
import {
    Key,
    ReactElement,
    JSXElementConstructor,
    ReactNode,
    ReactPortal,
    useState,
} from 'react';
import { columns } from './columns';
import SaveDialog from './save-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Personnel({ personnels, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    // ✅ SERVER SEARCH TRIGGER
    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/personnels',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
    // const { data: personnels } = useQuery({
    //     queryKey: ['personnels'],
    //     queryFn: PersonnelService.GetAll,
    //     initialData: [],
    // });

    return (
        <>
            <Head title="Personnels" />

            <div className="flex flex-col gap-4 p-4">
                {/* SEARCH */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-5">
                        <Input
                            placeholder="Search Personnel..."
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

                    <div>
                        <SaveDialog open={openSaveDialog} />
                        <Button onClick={() => setOpenSaveDialog(true)}>
                            Add Personnel
                        </Button>
                        {/* <Link href="/create-trainee">Add Trainee</Link> */}
                    </div>
                </div>

                {/* TABLE (NO LOCAL FILTERING) */}
                <DataTable columns={columns} data={personnels.data} />

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 pt-4">
                    {personnels.links.map((link: any, i: number) => (
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
Personnel.layout = {
    breadcrumbs: [
        {
            title: 'Manage Personnels',
            href: personnel(),
        },
    ],
};
