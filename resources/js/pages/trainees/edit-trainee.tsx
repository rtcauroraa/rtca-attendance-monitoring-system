import { useForm, Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CloudCog } from 'lucide-react';
import { toast } from 'sonner';
import { Trainee } from '@/@types/Trainees';

const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
};

const formattedDateTime = new Date().toLocaleString('en-US', options);
// Output: June 14, 2026, 4:20 PM
export default function EditTrainee({ trainee }: { trainee: Trainee }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: trainee.first_name || '',
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name || '',
        serial_number: trainee.serial_number || '',
        suffix: trainee.suffix || '',
        birthday: trainee.birthday || '',
        religion: trainee.religion || '',
        contact_no: trainee.contact_no || '',
        email: trainee.email || '',
        status: trainee.status || '',
        coy: trainee.coy || '',
        address: trainee.address || '',
        emergency_contact_person: trainee.emergency_contact_person || '',
        emergency_contact_no: trainee.emergency_contact_no || '',
        blood_type: trainee.blood_type || '',
        height: trainee.height || '',
        weight: trainee.weight || '',
        identifying_marks: trainee.identifying_marks || '',
        eye_color: trainee.eye_color || '',
        hair_color: trainee.hair_color || '',
    });

    const religions = [
        'Roman Catholic',
        'Islam',
        'Iglesia ni Cristo',
        'Aglipayan',
        'Seventh-day Adventist',
        "Jehovah's Witnesses",
        'Born Again Christian',
        'Protestant',
        'Other Christian',
        'Buddhism',
        'Hinduism',
        'None',
        'United Penticostal Church',
    ];

    const statuses = ['Single', 'Married', 'Widowed'];

    const bloodTypes = ['A', 'A+', 'B', 'B+', 'AB', 'O', 'O+'];
    const coy = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/trainees/${trainee.id}/update`, {
            onSuccess: () => {
                toast.success('Trainee has been updated successfully.', {
                    description: formattedDateTime,
                    duration: 4000,
                    position: 'top-center',
                });
                router.reload();
            },
        });
    };

    return (
        <>
            <Head title="Edit Trainee" />

            <div className="flex h-full flex-1 flex-col overflow-auto p-4 md:p-6 lg:p-10">
                <div className="mx-auto w-full max-w-7xl">
                    <form onSubmit={submit}>
                        <FieldSet>
                            <FieldLegend className="text-lg font-semibold">
                                Edit Trainee Information
                            </FieldLegend>
                            <FieldDescription>
                                Update the trainee information below. Click
                                Submit when you're done.
                            </FieldDescription>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {/* NAME */}
                                <Field>
                                    <FieldLabel>First Name</FieldLabel>
                                    <Input
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Middle Name</FieldLabel>
                                    <Input
                                        value={data.middle_name}
                                        onChange={(e) =>
                                            setData(
                                                'middle_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Last Name</FieldLabel>
                                    <Input
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Serial Number</FieldLabel>
                                    <Input
                                        value={data.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                {/* BIRTHDAY */}
                                <Field>
                                    <FieldLabel>Birthday</FieldLabel>
                                    <Input
                                        type="date"
                                        value={data.birthday}
                                        onChange={(e) =>
                                            setData('birthday', e.target.value)
                                        }
                                    />
                                    {errors.birthday && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.birthday}
                                        </span>
                                    )}
                                </Field>

                                {/* RELIGION */}
                                <Field>
                                    <FieldLabel>Religion</FieldLabel>
                                    <Select
                                        value={data.religion?.trim()}
                                        onValueChange={(value) =>
                                            setData('religion', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {religions.map((r) => (
                                                    <SelectItem
                                                        key={r}
                                                        value={r}
                                                    >
                                                        {r}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {errors.religion && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.religion}
                                        </span>
                                    )}
                                </Field>

                                {/* CONTACT */}
                                <Field>
                                    <FieldLabel>Contact No</FieldLabel>
                                    <Input
                                        value={data.contact_no}
                                        onChange={(e) =>
                                            setData(
                                                'contact_no',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    {errors.contact_no && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.contact_no}
                                        </span>
                                    )}
                                </Field>

                                {/* EMAIL */}
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.email}
                                        </span>
                                    )}
                                </Field>

                                {/* STATUS */}
                                <Field>
                                    <FieldLabel>Marital Status</FieldLabel>
                                    <Select
                                        value={data.status?.trim()}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Marital status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statuses.map((s) => (
                                                    <SelectItem
                                                        key={s}
                                                        value={s}
                                                    >
                                                        {s}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Suffix</FieldLabel>
                                    <Select
                                        value={data.suffix.trim()}
                                        onValueChange={(value) =>
                                            setData('suffix', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Suffix" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {[
                                                    'N/A',
                                                    'Jr.',
                                                    'Sr.',
                                                    'II',
                                                    'III',
                                                    'IV',
                                                ].map((label) => (
                                                    <SelectItem
                                                        key={label}
                                                        value={label}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* ADDRESS */}

                                {/* EMERGENCY PERSON */}
                                <Field>
                                    <FieldLabel>
                                        Emergency Contact Person
                                    </FieldLabel>
                                    <Input
                                        value={data.emergency_contact_person}
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact_person',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    {errors.emergency_contact_person && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.emergency_contact_person}
                                        </span>
                                    )}
                                </Field>

                                {/* EMERGENCY NO */}
                                <Field>
                                    <FieldLabel>
                                        Emergency Contact No
                                    </FieldLabel>
                                    <Input
                                        value={data.emergency_contact_no}
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact_no',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    {errors.emergency_contact_no && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.emergency_contact_no}
                                        </span>
                                    )}
                                </Field>

                                {/* BLOOD TYPE */}
                                <Field>
                                    <FieldLabel>Blood Type</FieldLabel>
                                    <Select
                                        value={data.blood_type}
                                        onValueChange={(value) =>
                                            setData('blood_type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {bloodTypes.map((b) => (
                                                    <SelectItem
                                                        key={b}
                                                        value={b}
                                                    >
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* HEIGHT */}
                                <Field>
                                    <FieldLabel>Height (cm)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={data.height}
                                        onChange={(e) =>
                                            setData('height', e.target.value)
                                        }
                                    />

                                    {errors.height && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.height}
                                        </span>
                                    )}
                                </Field>

                                {/* WEIGHT */}
                                <Field>
                                    <FieldLabel>Weight (kg)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={data.weight}
                                        onChange={(e) =>
                                            setData('weight', e.target.value)
                                        }
                                    />
                                    {errors.weight && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.weight}
                                        </span>
                                    )}
                                </Field>

                                {/* MARKS */}
                                <Field>
                                    <FieldLabel>Identifying Marks</FieldLabel>
                                    <Input
                                        value={data.identifying_marks}
                                        onChange={(e) =>
                                            setData(
                                                'identifying_marks',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.identifying_marks && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.identifying_marks}
                                        </span>
                                    )}
                                </Field>

                                {/* EYE */}
                                <Field>
                                    <FieldLabel>Eye Color</FieldLabel>
                                    <Input
                                        value={data.eye_color}
                                        onChange={(e) =>
                                            setData('eye_color', e.target.value)
                                        }
                                    />
                                    {errors.eye_color && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.eye_color}
                                        </span>
                                    )}
                                </Field>

                                {/* HAIR */}
                                <Field>
                                    <FieldLabel>Hair Color</FieldLabel>
                                    <Input
                                        value={data.hair_color}
                                        onChange={(e) =>
                                            setData(
                                                'hair_color',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.hair_color && (
                                        <span className="text-sm leading-tight text-destructive">
                                            {errors.hair_color}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Coy</FieldLabel>
                                    <Select
                                        value={data.coy}
                                        onValueChange={(value) =>
                                            setData('coy', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Coy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {coy.map((b) => (
                                                    <SelectItem
                                                        key={b}
                                                        value={b}
                                                    >
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <Field className="md:col-span-2 xl:col-span-3">
                                <FieldLabel>Address</FieldLabel>
                                <Textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <span className="text-sm leading-tight text-destructive">
                                        {errors.address}
                                    </span>
                                )}
                            </Field>

                            <div className="mt-8 flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update'}
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => reset()}
                                >
                                    <Link href="/trainees">Cancel</Link>
                                </Button>
                            </div>
                        </FieldSet>
                    </form>
                </div>
            </div>
        </>
    );
}
