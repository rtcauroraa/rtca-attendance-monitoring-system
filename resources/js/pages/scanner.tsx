import React, { Component, useRef, useState } from 'react';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { formatDateToMilitary } from '@/utils/formatDateToMilitary';
import Tabs02 from '@/pages/tabs-02';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCheck, TriangleAlertIcon } from 'lucide-react';
export default function ScannerPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [person, setPerson] = useState<any>(null);
    const [type, setType] = useState<string | null>(null);
    const scanLockRef = useRef(false);
    const [scannerKey, setScannerKey] = useState(0);
    const lastQRRef = useRef<string | null>(null);

    const handleScan = (results: any) => {
        const raw = results?.[0]?.rawValue;
        if (!raw) return;

        if (scanLockRef.current) return; // 🔥 HARD BLOCK
        if (lastQRRef.current === raw) return;
        lastQRRef.current = raw;
        scanLockRef.current = true; // LOCK IMMEDIATELY

        const [type, id] = raw.split('_');

        router.get(
            `/scan/${type}/${id}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setPerson(page.props.data);
                    setType(type);
                    setModalOpen(true);
                },
            },
        );
    };

    const [selectedDevice, setSelectedDevice] = useState(null);
    const highlightCodeOnCanvas = (detectedCodes: any, ctx: any) => {
        detectedCodes.forEach((detectedCode: any) => {
            const { boundingBox, cornerPoints } = detectedCode;

            // Draw bounding box
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 4;
            ctx.strokeRect(
                boundingBox.x,
                boundingBox.y,
                boundingBox.width,
                boundingBox.height,
            );

            // Draw corner points
            ctx.fillStyle = '#FFFFFF';
            cornerPoints.forEach((point: any) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
    };

    const [openLiberty, setOpenLiberty] = useState(false);
    const [openAshoreForm, setOpenAshoreForm] = useState(false);
    const [openAboardForm, setOpenAboardForm] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        duration: '',
        time: '',
    });

    const durationOptions = Array.from({ length: 16 }, (_, index) => {
        const date = new Date();

        date.setDate(date.getDate() + index);

        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        return {
            value: index.toString(),
            days: index,
            label:
                index === 0
                    ? `Today Only (${formattedDate})`
                    : `${index} Day${index > 1 ? 's' : ''} (${formattedDate})`,
        };
    });

    const closeModal = () => {
        setModalOpen(false);
        setPerson(null);
        setType(null);
        reset();

        scanLockRef.current = false;
        lastQRRef.current = null;
        scanLockRef.current = false;
        setOpenAshoreForm(false);

        lastQRRef.current = null;

        setTimeout(() => {
            setScannerKey((prev) => prev + 1); // 🔥 fully resets scanner engine
        }, 300);
    };

    const submitAshore = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            `/ashore-post/${person?.id}`,
            {
                duration: data.duration,
                time: data.time,
                trainee_id: person?.id,
            },
            {
                preserveState: true,
                preserveScroll: true,

                onSuccess: () => {
                    toast.success('Ashore pass created successfully.', {
                        position: 'top-center',
                        style: {
                            '--normal-bg': 'var(--background)',
                            '--normal-text':
                                'light-dark(var(--color-green-600), var(--color-green-400))',
                            '--normal-border':
                                'light-dark(var(--color-green-600), var(--color-green-400))',
                        } as React.CSSProperties,
                    });
                    closeModal();
                },

                onError: (errors) => {
                    if (errors.ashore) {
                        toast.error(errors.ashore, {
                            position: 'top-center',
                            style: {
                                '--normal-bg': 'var(--background)',
                                '--normal-text': 'var(--destructive)',
                                '--normal-border': 'var(--destructive)',
                            } as React.CSSProperties,
                            icon: <TriangleAlertIcon />,
                        });
                        closeModal();
                        return;
                    }

                    toast.error('Please fill in all required fields.', {
                        position: 'top-center',
                        style: {
                            '--normal-bg': 'var(--background)',
                            '--normal-text': 'var(--destructive)',
                            '--normal-border': 'var(--destructive)',
                        } as React.CSSProperties,
                        icon: <TriangleAlertIcon />,
                    });
                },
            },
        );
    };

    const [pendingAboardId, setPendingAboardId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleAboardClick = (personID: number) => {
        setPendingAboardId(personID);
        setConfirmOpen(true);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="m-5 mt-[-50px] w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-md">
                <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {loading
                                    ? 'Loading...'
                                    : person
                                      ? `${type === 'person' ? 'CCGNO ' : ''}${[
                                            person.first_name,
                                            person.middle_name,
                                            person.last_name,
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}`
                                      : ''}
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                {type === 'Trainee' && 'Select action below.'}
                                {type === 'Personnel' &&
                                    'Personnel record detected.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {!loading && person && (
                            <div className="flex flex-col gap-2 py-2">
                                {type === 'Trainee' && (
                                    <>
                                        {/* Liberty */}
                                        <Dialog
                                            open={openLiberty}
                                            onOpenChange={setOpenLiberty}
                                        >
                                            <DialogTrigger asChild>
                                                <Button>LIBERTY</Button>
                                            </DialogTrigger>

                                            <DialogContent className="w-[400px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Please Choose Action
                                                    </DialogTitle>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        className="secondary"
                                                        onClick={() => {
                                                            setOpenLiberty(
                                                                false,
                                                            );
                                                            setOpenAshoreForm(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Ashore
                                                    </Button>

                                                    <Button
                                                        onClick={() =>
                                                            handleAboardClick(
                                                                person.id,
                                                            )
                                                        }
                                                    >
                                                        Aboard
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog
                                            open={confirmOpen}
                                            onOpenChange={setConfirmOpen}
                                        >
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Confirm Aboard Action
                                                    </AlertDialogTitle>

                                                    <AlertDialogDescription>
                                                        Are you sure this
                                                        trainee is now aboard?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        onClick={() =>
                                                            setConfirmOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            if (
                                                                !pendingAboardId
                                                            )
                                                                return;

                                                            router.post(
                                                                `/aboard-post/${pendingAboardId}`,
                                                                {},
                                                                {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                    onSuccess:
                                                                        () => {
                                                                            toast.success(
                                                                                'Trainee marked as aboard',
                                                                                {
                                                                                    position:
                                                                                        'top-center',
                                                                                    style: {
                                                                                        '--normal-bg':
                                                                                            'var(--background)',
                                                                                        '--normal-text':
                                                                                            'light-dark(var(--color-green-600), var(--color-green-400))',
                                                                                        '--normal-border':
                                                                                            'light-dark(var(--color-green-600), var(--color-green-400))',
                                                                                    } as React.CSSProperties,
                                                                                },
                                                                            );
                                                                            closeModal();
                                                                        },
                                                                    onError: (
                                                                        errors,
                                                                    ) => {
                                                                        toast.error(
                                                                            errors.ashore ||
                                                                                'Error occurred',
                                                                            {
                                                                                position:
                                                                                    'top-center',
                                                                                style: {
                                                                                    '--normal-bg':
                                                                                        'var(--background)',
                                                                                    '--normal-text':
                                                                                        'var(--destructive)',
                                                                                    '--normal-border':
                                                                                        'var(--destructive)',
                                                                                } as React.CSSProperties,
                                                                                icon: (
                                                                                    <TriangleAlertIcon />
                                                                                ),
                                                                            },
                                                                        );
                                                                    },
                                                                },
                                                            );

                                                            setConfirmOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        Confirm
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Dialog
                                            open={openAshoreForm}
                                            onOpenChange={setOpenAshoreForm}
                                        >
                                            <DialogContent className="w-[400px]">
                                                <form onSubmit={submitAshore}>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Ashore Details
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    {/* Duration */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">
                                                            Duration
                                                        </label>

                                                        <Select
                                                            value={
                                                                data.duration
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                setData(
                                                                    'duration',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Duration" />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {durationOptions.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Time */}
                                                    <div>
                                                        <label className="mb-1 block text-sm">
                                                            Time
                                                        </label>

                                                        <Input
                                                            type="time"
                                                            value={data.time}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'time',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setOpenAshoreForm(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>

                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            {processing
                                                                ? 'Submitting...'
                                                                : 'Submit'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        {/* SECOND DIALOG */}

                                        <Button>LEAVE</Button>
                                        <Button>OFFICIAL BUSINESS</Button>
                                    </>
                                )}

                                {type === 'Personnel' && (
                                    <Button variant="outline">
                                        VIEW PROFILE
                                    </Button>
                                )}

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            VIEW PROFILE
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent
                                        onOpenAutoFocus={(e) => {
                                            e.preventDefault();
                                            document
                                                .getElementById(
                                                    'dialog-title-focus',
                                                )
                                                ?.focus();
                                        }}
                                        className="max-h-[90dvh] max-w-[90vw] overflow-y-auto sm:max-w-[800px]"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                Trainee Details
                                            </DialogTitle>
                                        </DialogHeader>

                                        {/* DETAILS */}

                                        <div
                                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                            id="dialog-title-focus"
                                            tabIndex={-1}
                                        >
                                            <div>
                                                <label className="text-xs text-gray-500">
                                                    Full Name
                                                </label>
                                                <input
                                                    readOnly
                                                    value={`${person?.first_name} ${person?.middle_name ?? ''} ${person?.last_name} ${person?.suffix && person?.suffix !== 'N/A' ? person?.suffix : ''}`}
                                                    className="w-full rounded border bg-gray-100 px-3 py-2"
                                                />
                                            </div>
                                            {/* SERIAL NUMBER */}
                                            <div>
                                                <label className="text-xs text-gray-500">
                                                    Email
                                                </label>
                                                <input
                                                    readOnly
                                                    value={person?.email ?? ''}
                                                    className="w-full rounded border bg-gray-100 px-3 py-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-sm">
                                            {/* NAME */}

                                            {/* EMAIL */}

                                            {/* SERIAL NUMBER */}

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Company Coy
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.coy ?? ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                {/* SERIAL NUMBER */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Serial Number
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.serial_number ??
                                                            ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Religion
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.religion ??
                                                            ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                {/* SERIAL NUMBER */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Marital Status
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.status ?? ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.contact_no ??
                                                            ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>

                                                {/* BIRTHDAY */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Birthday
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={formatDateToMilitary(
                                                            person?.birthday,
                                                        )}
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Emergency Contact Person
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.emergency_contact_person ??
                                                            ''
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>

                                                {/* BIRTHDAY */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Emergeny Contact Number
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.emergency_contact_no
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Height
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={`${person?.height} cm`}
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                {/* BIRTHDAY */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Weight
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={`${person?.weight} kg`}
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Weight
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.blood_type
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Eye Color
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={`${person?.eye_color}`}
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                {/* BIRTHDAY */}
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Hair Color
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.hair_color
                                                        }
                                                        className="w-full rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">
                                                        Identifying Marks
                                                    </label>
                                                    <input
                                                        readOnly
                                                        value={
                                                            person?.identifying_marks
                                                        }
                                                        className="w-full overflow-x-auto rounded border bg-gray-100 px-3 py-2"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-500">
                                                    Address
                                                </label>
                                                <input
                                                    readOnly
                                                    value={person?.address}
                                                    className="w-full overflow-x-auto rounded border bg-gray-100 px-3 py-2"
                                                />
                                            </div>
                                            <hr className="my-4 border-t border-gray-300" />

                                            <Tabs02 />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={closeModal}>
                                Close
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="flex justify-center">
                    <Scanner
                        onScan={handleScan}
                        key={scannerKey}
                        onError={(error) => console.error(error)}
                        components={{
                            tracker: highlightCodeOnCanvas,
                            finder: false,
                        }}
                        constraints={{ deviceId: selectedDevice }}
                    />
                </div>
            </div>
        </div>
    );
}
