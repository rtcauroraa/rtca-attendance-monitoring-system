import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
};

const formattedDateTime = new Date().toLocaleString('en-US');
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
import { Head, Link, router } from '@inertiajs/react';
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

export default function EditUser({ user }: any) {
    console.log(user);
    const { data, setData, put, processing, errors, reset } = useForm({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put('/users', {
            onSuccess: () => {
                toast.success('User has been updated successfully.', {
                    description: formattedDateTime,
                    duration: 4000,
                    position: 'top-center',
                });
                reset();
                router.get('/users');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };
    return (
        <>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col overflow-auto p-4 md:p-6 lg:p-10">
                <div className="mx-auto w-full max-w-7xl">
                    <form onSubmit={submit}>
                        <FieldSet>
                            <FieldLegend className="mb-6 text-lg font-semibold">
                                User Personal Information
                            </FieldLegend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <Input
                                    hidden
                                    value={data.id}
                                    onChange={(e) =>
                                        setData('id', e.target.value)
                                    }
                                />
                                {/* Standard Text Input */}
                                <Field>
                                    <FieldLabel>Name</FieldLabel>
                                    <Input
                                        placeholder="Enter Name"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <span className="text-sm text-destructive">
                                            {errors.name}
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        placeholder="Enter Email"
                                        type="email"
                                        required
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
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        placeholder="Enter Password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-destructive">
                                            {errors.password}
                                        </span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Confirm Password</FieldLabel>
                                    <Input
                                        placeholder="Enter Confirm Password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.password_confirmation && (
                                        <span className="text-sm text-destructive">
                                            {errors.password_confirmation}
                                        </span>
                                    )}
                                </Field>
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update'}
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => reset()}
                                >
                                    <Link href="/users">Cancel</Link>
                                </Button>
                            </div>
                        </FieldSet>
                    </form>
                </div>
            </div>
        </>
    );
}
