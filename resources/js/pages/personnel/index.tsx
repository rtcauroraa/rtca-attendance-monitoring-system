import { Link, router } from '@inertiajs/react';
import {
    Key,
    ReactElement,
    JSXElementConstructor,
    ReactNode,
    ReactPortal,
} from 'react';

export default function Index({ personnels }: any) {
    const destroy = (id: any) => {
        if (confirm('Delete this personnel?')) {
            router.delete(`/personnels/${id}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">personnels</h1>

            <Link
                href="/personnels/create"
                className="rounded bg-blue-500 px-4 py-2 text-white"
            >
                Create personnel
            </Link>

            <table className="mt-4 w-full border">
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
                        <tr key="{personnel.id}">
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

                                <button
                                    onClick={() => destroy(personnel.id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
