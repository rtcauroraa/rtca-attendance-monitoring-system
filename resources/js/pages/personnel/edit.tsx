import { useForm } from '@inertiajs/react';

export default function Edit({ personnel }: any) {
    const { data, setData, perso, processing, errors } = useForm({
        rank: personnel.rank,
        lastname: personnel.lastname,
        firstname: personnel.firstname,
        middlename: personnel.middlename,
        suffix: personnel.suffix,
        serialno: personnel.serialno,
        email: personnel.email,
        duty_status: personnel.duty_status,
        primary_designation: personnel.primary_designation,
        other_designation: personnel.other_designation,
        date_of_last_promotion: personnel.date_of_last_promotion,
        date_entered_service: personnel.date_entered_service,
        date_enlisted_or_commissioned: personnel.date_enlisted_or_commissioned,
    });

    const submit = (e: any) => {
        e.preventDefault();
        // put(`/personnel/${personnel.id}`);
    };

    return (
        <div className="p-6">
            <h1>Create Personnel</h1>

            <form onSubmit={submit}>
                <input
                    type="text"
                    placeholder="Rank"
                    value={data.rank}
                    onChange={(e) => setData('rank', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.rank && (
                    <div className="text-red-500">{errors.rank}</div>
                )}

                <input
                    type="text"
                    placeholder="Firstname"
                    value={data.firstname}
                    onChange={(e) => setData('firstname', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.firstname && (
                    <div className="text-red-500">{errors.firstname}</div>
                )}
                <input
                    type="text"
                    placeholder="Lastname"
                    value={data.lastname}
                    onChange={(e) => setData('lastname', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.lastname && (
                    <div className="text-red-500">{errors.lastname}</div>
                )}

                <input
                    type="text"
                    placeholder="Middlename"
                    value={data.middlename}
                    onChange={(e) => setData('middlename', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.middlename && (
                    <div className="text-red-500">{errors.middlename}</div>
                )}

                <input
                    type="text"
                    placeholder="Suffix"
                    value={data.suffix}
                    onChange={(e) => setData('suffix', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.suffix && (
                    <div className="text-red-500">{errors.suffix}</div>
                )}

                <input
                    type="text"
                    placeholder="Serial Number"
                    value={data.serialno}
                    onChange={(e) => setData('serialno', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.serialno && (
                    <div className="text-red-500">{errors.serialno}</div>
                )}

                <input
                    type="text"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.email && (
                    <div className="text-red-500">{errors.email}</div>
                )}

                <input
                    type="text"
                    placeholder="duty status"
                    value={data.duty_status}
                    onChange={(e) => setData('duty_status', e.target.value)}
                    className="mb-2 w-full border p-2"
                />

                {errors.duty_status && (
                    <div className="text-red-500">{errors.duty_status}</div>
                )}

                <input
                    type="text"
                    placeholder="Primary Designation"
                    value={data.primary_designation}
                    onChange={(e) =>
                        setData('primary_designation', e.target.value)
                    }
                    className="mb-2 w-full border p-2"
                />

                {errors.primary_designation && (
                    <div className="text-red-500">
                        {errors.primary_designation}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Other Designation"
                    value={data.other_designation}
                    onChange={(e) =>
                        setData('other_designation', e.target.value)
                    }
                    className="mb-2 w-full border p-2"
                />

                {errors.other_designation && (
                    <div className="text-red-500">
                        {errors.other_designation}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Date Entered Service"
                    value={data.date_entered_service}
                    onChange={(e) =>
                        setData('date_entered_service', e.target.value)
                    }
                    className="mb-2 w-full border p-2"
                />

                {errors.date_entered_service && (
                    <div className="text-red-500">
                        {errors.date_entered_service}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Date Last Promotion"
                    value={data.date_of_last_promotion}
                    onChange={(e) =>
                        setData('date_of_last_promotion', e.target.value)
                    }
                    className="mb-2 w-full border p-2"
                />

                {errors.date_of_last_promotion && (
                    <div className="text-red-500">
                        {errors.date_of_last_promotion}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Date Enlisted/Commisioned"
                    value={data.date_enlisted_or_commissioned}
                    onChange={(e) =>
                        setData('date_enlisted_or_commissioned', e.target.value)
                    }
                    className="mb-2 w-full border p-2"
                />

                {errors.date_enlisted_or_commissioned && (
                    <div className="text-red-500">
                        {errors.date_enlisted_or_commissioned}
                    </div>
                )}

                <button
                    disabled={processing}
                    className="bg-blue-500 px-4 py-2 text-white"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
