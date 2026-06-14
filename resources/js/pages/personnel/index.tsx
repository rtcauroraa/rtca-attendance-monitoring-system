import { DataTable } from '@/components/ui/data-table';
import PersonnelService from '@/services/personnel-service';
import { Link, router } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
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

export default function Index() {

    const [openSaveDialog,setOpenSaveDialog] = useState<boolean>(false)
    const { data: personnels } = useQuery({
        queryKey: ["personnels"],
        queryFn: PersonnelService.GetAll,
        initialData: []
    })



    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Manage Personnel</h1>

<SaveDialog open={openSaveDialog}/>
            <Button
             onClick={()=>setOpenSaveDialog(true)}
            >
                Create Personnel
            </Button>
            <DataTable columns={columns} data={personnels} 
            globalFilter={''} setGlobalFilter={function (value: string): void {
                throw new Error('Function not implemented.');
            }} />
            {/* <table className="mt-4 w-full border">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>RANK</th>
                        <th>LASTNAME</th>
                        <th>FIRSTNAME</th>
                        <th>MIDDLENAME</th>
                        <th>SERIAL NO</th>
                        <th>DUTY STATUS</th>
                        <th>EMAIL</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {personnels.map((personnel: any) => (
                        <tr key={personnel.id}>
                            <td>{personnel.id}</td>
                            <td>{personnel.rank}</td>
                            <td>{personnel.lastname}</td>
                            <td>{personnel.firstname}</td>
                            <td>{personnel.middlename}</td>
                            <td>{personnel.serialno} PCG</td>
                            <td>{personnel.duty_status}</td>
                            <td>{personnel.email}</td>
                            <td>
                                <Link
                                    href={`/personnels/${personnel.id}/edit`}
                                    className="mr-3 text-blue-500"
                                >
                                    Edit
                                </Link>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}
