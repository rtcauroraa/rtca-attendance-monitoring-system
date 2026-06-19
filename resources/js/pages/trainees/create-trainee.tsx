import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

<<<<<<< HEAD
const options: any = {
=======
const options:any = {
>>>>>>> 66556ca562ee05b871d0d6115077509283438523
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
};

const formattedDateTime = new Date().toLocaleString('en-US', options);
// Output: June 14, 2026, 4:20 PM

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { CloudCog } from 'lucide-react';
import { toast, useSonner } from 'sonner';

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
    'Other Religion',
    'None',
    'Prefer not to say',
];

export default function CreateTrainee() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        serial_number: '',
        suffix: '',
        birthday: '',
        religion: '',
        contact_no: '',
        email: '',
        status: '',
        coy: '',
        address: '',
        emergency_contact_person: '',
        emergency_contact_no: '',
        blood_type: '',
        height: '',
        weight: '',
        identifying_marks: '',
        eye_color: '',
        hair_color: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/trainees/', {
            onSuccess: () => {
                toast.success('Trainee has been created successfully.', {
                    description: formattedDateTime,
                    duration: 4000,
                    position: 'top-center',
                });
                reset();
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };
    return (
        <>
            <Head title="Create Trainee" />
            <div className="flex h-full flex-1 flex-col overflow-auto p-4 md:p-6 lg:p-10">
                <div className="mx-auto w-full max-w-7xl">
                    <form onSubmit={submit}>
                        <FieldSet>
                            <FieldLegend className="text-lg font-semibold">
                                Trainee Personal Information
                            </FieldLegend>
                            <FieldDescription>
                                Fill in the information below to register new
                                trainee. Click submit when you're done.{' '}
                            </FieldDescription>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {/* Standard Text Input */}
                                <Field>
                                    <FieldLabel>First Name</FieldLabel>
                                    <Input
                                        placeholder="Enter First Name"
                                        required
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.first_name && (
                                        <span className="text-sm text-destructive">
                                            {errors.first_name}
                                        </span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Middle Name</FieldLabel>
                                    <Input
                                        placeholder="Enter Middle Name"
                                        required
                                        value={data.middle_name}
                                        onChange={(e) =>
                                            setData(
                                                'middle_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.middle_name && (
                                        <span className="text-sm text-destructive">
                                            {errors.middle_name}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Last Name</FieldLabel>
                                    <Input
                                        placeholder="Enter Last Name"
                                        required
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                    />
                                    {errors.last_name && (
                                        <span className="text-sm text-destructive">
                                            {errors.last_name}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Serial Number</FieldLabel>
                                    <Input
                                        placeholder="Enter Serial Number"
                                        required
                                        type="number"
                                        value={data.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.serial_number && (
                                        <span className="text-sm text-destructive">
                                            {errors.serial_number}
                                        </span>
                                    )}
                                </Field>

                                {/* Date Input */}
                                <Field>
                                    <FieldLabel>Birthday</FieldLabel>
                                    <Input
                                        type="date"
                                        required
                                        value={data.birthday}
                                        min="1900-01-01"
                                        onChange={(e) =>
                                            setData('birthday', e.target.value)
                                        }
                                    />
                                    {errors.birthday && (
                                        <span className="text-sm text-destructive">
                                            {errors.birthday}
                                        </span>
                                    )}
                                </Field>

                                {/* Radix / Shadcn UI Select Component */}
                                <Field>
                                    <FieldLabel>Religion</FieldLabel>
                                    <Select
                                        value={data.religion}
                                        onValueChange={(value) =>
                                            setData('religion', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {religions.map((religion) => (
                                                    <SelectItem
                                                        key={religion}
                                                        value={religion}
                                                    >
                                                        {religion}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.religion && (
                                        <span className="text-sm text-destructive">
                                            {errors.religion}
                                        </span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Contact No.</FieldLabel>
                                    <Input
                                        required
                                        type="text"
                                        maxLength={11}
                                        pattern="[0-9]{11}"
                                        inputMode="numeric"
                                        value={data.contact_no}
                                        placeholder="Enter Contact Number"
                                        onChange={(e) =>
                                            setData(
                                                'contact_no',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.contact_no && (
                                        <span className="text-sm text-destructive">
                                            {errors.contact_no}
                                        </span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="Enter Email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-destructive">
                                            {errors.email}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Marital Status</FieldLabel>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Marital Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {[
                                                    'Single',
                                                    'Married',
                                                    'Widowed',
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
                                    {errors.status && (
                                        <span className="text-sm text-destructive">
                                            {errors.status}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <Select
                                        value={data.suffix}
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
                                    {errors.suffix && (
                                        <span className="text-sm text-destructive">
                                            {errors.suffix}
                                        </span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Emergency Contact Person
                                    </FieldLabel>
                                    <Input
                                        placeholder="Enter Emergency Contact Person"
                                        required
                                        maxLength={11}
                                        pattern="[0-9]{11}"
                                        inputMode="numeric"
                                        value={data.emergency_contact_person}
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact_person',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.emergency_contact_person && (
                                        <span className="text-sm text-destructive">
                                            {errors.emergency_contact_person}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Emergency Contact No.
                                    </FieldLabel>
                                    <Input
                                        placeholder="Enter Emergency Contact No"
                                        required
                                        type="text"
                                        value={data.emergency_contact_no}
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact_no',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.emergency_contact_no && (
                                        <span className="text-sm text-destructive">
                                            {errors.emergency_contact_no}
                                        </span>
                                    )}
                                </Field>

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
                                                {[
                                                    'A',
                                                    'A+',
                                                    'B',
                                                    'B+',
                                                    'AB',
                                                    'O',
                                                    'O+',
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
                                    {errors.blood_type && (
                                        <span className="text-sm text-destructive">
                                            {errors.blood_type}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Height (cm)</FieldLabel>
                                    <Input
                                        placeholder="Enter Height (cm)"
                                        type="number"
                                        value={data.height}
                                        onChange={(e) =>
                                            setData('height', e.target.value)
                                        }
                                    />
                                    {errors.height && (
                                        <span className="text-sm text-destructive">
                                            {errors.height}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Weight (kg)</FieldLabel>
                                    <Input
                                        type="number"
                                        placeholder="Enter Weight in Kg"
                                        value={data.weight}
                                        onChange={(e) =>
                                            setData('weight', e.target.value)
                                        }
                                    />
                                    {errors.weight && (
                                        <span className="text-sm text-destructive">
                                            {errors.weight}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Identifying Marks</FieldLabel>
                                    <Input
                                        value={data.identifying_marks}
                                        placeholder="Enter Identifying Marks"
                                        onChange={(e) =>
                                            setData(
                                                'identifying_marks',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.identifying_marks && (
                                        <span className="text-sm text-destructive">
                                            {errors.identifying_marks}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Eye Color</FieldLabel>
                                    <Input
                                        value={data.eye_color}
                                        placeholder="Enter Eye Color"
                                        onChange={(e) =>
                                            setData('eye_color', e.target.value)
                                        }
                                    />
                                    {errors.eye_color && (
                                        <span className="text-sm text-destructive">
                                            {errors.eye_color}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Hair Color</FieldLabel>
                                    <Input
                                        placeholder="Enter Hair Color"
                                        value={data.hair_color}
                                        onChange={(e) =>
                                            setData(
                                                'hair_color',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.hair_color && (
                                        <span className="text-sm text-destructive">
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
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {[
                                                    'Alpha',
                                                    'Bravo',
                                                    'Charlie',
                                                    'Delta',
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
                                    {errors.coy && (
                                        <span className="text-sm text-destructive">
                                            {errors.coy}
                                        </span>
                                    )}
                                </Field>
                            </div>
                            <Field className="xl:col-span-3">
                                <FieldLabel>Address</FieldLabel>
                                <Textarea
                                    rows={4}
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <span className="text-sm text-destructive">
                                        {errors.address}
                                    </span>
                                )}
                            </Field>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit'}
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
