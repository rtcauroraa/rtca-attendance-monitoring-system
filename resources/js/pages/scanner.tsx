import React, { useRef, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useForm, router } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { AlertCircle, TriangleAlertIcon, X } from 'lucide-react';

export default function ScannerPage() {
    const [person, setPerson] = useState<any>(null);
    const scanLockRef = useRef(false);
    const lastQRRef = useRef<string | null>(null);
    const [scannerKey, setScannerKey] = useState(0);

    // 🔥VIEW PROFILE DIALOG
    const [openPersonDialog, setOpenPersonDialog] = useState(false);

    // 🔥 ACTION TYPE (LIBERTY / LEAVE / OFFICIAL BUSINESS)
    const [openActionTypeDialog, setOpenActionTypeDialog] = useState(true);

    // 🔥 MOVEMENT TYPE (ASHORE / ABOARD)
    const [movementTypeDialog, setMovementTypeDialog] = useState(false);

    const [openAshoreForm, setOpenAshoreForm] = useState(false);
    const [activeMode, setActiveMode] = useState<'ASHORE' | 'ABOARD' | null>(
        null,
    );

    const [actionType, setActionType] = useState<
        'LIBERTY' | 'LEAVE' | 'OFFICIAL_BUSINESS' | 'VIEW_PROFILE' | null
    >(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, reset, processing } = useForm({
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
            label:
                index === 0
                    ? `Today Only (${formattedDate})`
                    : `${index} Day${index > 1 ? 's' : ''} (${formattedDate})`,
        };
    });

    const closeModal = () => {
        setActionType(null);
        setActiveMode(null);
        setMovementTypeDialog(false);
        setScannerOpen(false);
        reset();

        scanLockRef.current = false;
        lastQRRef.current = null;

        setOpenAshoreForm(false);
        router.visit('/scanner', {
            replace: true,
            preserveState: true,
        });

        setTimeout(() => {
            setScannerKey((prev) => prev + 1);
        }, 300);
    };

    // ✅ ASHORE (UNCHANGED BACKEND)
    const submitAshore = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            `/trainee-movement/${person.id}`,
            {
                type: actionType, // LIBERTY | LEAVE | OFFICIAL_BUSINESS
                mode: activeMode,
                duration: data.duration,
                time: data.time,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Passes recorded successfully.', {
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
                    setOpenActionTypeDialog(true);
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
                        setOpenActionTypeDialog(true);
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

    const [notFoundDialogOpen, setNotFoundDialogOpen] = useState(false);
    // ✅ ABOARD (UNCHANGED BACKEND)
    const handleAboard = () => {
        router.post(
            `/trainee-movement/${person?.id}`,
            {
                type: actionType,
                mode: 'ABOARD',
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Trainee returned successfully.');
                    setOpenActionTypeDialog(false);
                    closeModal();
                    setOpenActionTypeDialog(true);
                },

                onError: (errors) => {
                    if (errors?.noMovement) {
                        toast.error(errors.noMovement, {
                            position: 'top-center',
                            style: {
                                '--normal-bg': 'var(--background)',
                                '--normal-text': 'var(--destructive)',
                                '--normal-border': 'var(--destructive)',
                            } as React.CSSProperties,
                            icon: <TriangleAlertIcon />,
                        });
                        closeModal();
                        setOpenActionTypeDialog(true);
                    } else {
                        toast.error('Error making aboard', {
                            position: 'top-center',
                            style: {
                                '--normal-bg': 'var(--background)',
                                '--normal-text': 'var(--destructive)',
                                '--normal-border': 'var(--destructive)',
                            } as React.CSSProperties,
                            icon: <TriangleAlertIcon />,
                        });
                        closeModal();
                        setOpenActionTypeDialog(true);
                    }
                },
            },
        );
    };

    const [scannerOpen, setScannerOpen] = useState(false);
    const handleScan = (results: any) => {
        setNotFoundDialogOpen(false);
        const raw = results?.[0]?.rawValue;
        if (!raw) return;

        if (scanLockRef.current) return;
        scanLockRef.current = true;

        const [type, id] = raw.split('_');

        router.get(
            `/scan/${type}/${id}`,
            {},
            {
                preserveState: true,
                onSuccess: (page) => {
                    setPerson(page.props.data);
                    setScannerOpen(true);

                    if (activeMode === 'ASHORE') {
                        setOpenAshoreForm(true);
                    } else if (activeMode === 'ABOARD') {
                        setConfirmOpen(true);
                    }

                    if (actionType === 'VIEW_PROFILE') {
                        setOpenPersonDialog(true);
                    }
                },

                onError: (errors) => {
                    setPerson(null);
                    setNotFoundDialogOpen(true);
                    router.visit('/scanner', {
                        replace: true,
                        preserveState: true,
                    });
                },
                onFinish: () => {
                    scanLockRef.current = false; // 🔥 ALWAYS RESET
                },
            },
        );
    };

    const durationLabel = (action: string | null) => {
        if (action === 'LIBERTY') return 'LIBERTY ACTION';
        if (action === 'LEAVE') return 'LEAVE ACTION';
        if (action === 'OFFICIAL_BUSINESS') return 'OFFICIAL BUSINESS';
        return '';
    };

    const highlightCodeOnCanvas = (detectedCodes: any, ctx: any) => {
        detectedCodes.forEach((detectedCode: any) => {
            const { boundingBox } = detectedCode;

            // Draw bounding box
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                boundingBox.x,
                boundingBox.y,
                boundingBox.width,
                boundingBox.height,
            );
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
                {/* MAIN SCAN RESULT MODAL */}
                {/* Alert dialog here */}

                <Dialog
                    open={notFoundDialogOpen}
                    onOpenChange={setNotFoundDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-x-2 text-red-600">
                                <AlertCircle />
                                No Trainee Found
                            </DialogTitle>

                            <DialogDescription>
                                The scanned QR code does not match any trainee
                                in the system.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setNotFoundDialogOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* ACTION DIALOG (LIBERTY / LEAVE / OFFICIAL BUSINESS) */}
                <Dialog
                    open={openActionTypeDialog}
                    onOpenChange={(open) => {
                        // Only allow opening programmatically.
                        // Ignore attempts to close from outside click or Esc.
                        if (open) {
                            setOpenActionTypeDialog(true);
                        }
                    }}
                >
                    <DialogContent
                        className="w-[80vw] md:max-w-[400px]"
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        showCloseButton={false}
                    >
                        <DialogHeader>
                            <DialogTitle>
                                {durationLabel(activeMode)}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => {
                                    setActionType('LIBERTY');
                                    setOpenActionTypeDialog(false);
                                    setMovementTypeDialog(true);
                                }}
                            >
                                LIBERTY
                            </Button>

                            <Button
                                onClick={() => {
                                    setActionType('LEAVE');
                                    setOpenActionTypeDialog(false);
                                    setMovementTypeDialog(true);
                                }}
                            >
                                LEAVE
                            </Button>

                            <Button
                                onClick={() => {
                                    setActionType('OFFICIAL_BUSINESS');
                                    setOpenActionTypeDialog(false);
                                    setMovementTypeDialog(true);
                                }}
                            >
                                OFFICIAL BUSINESS
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    // setActiveMode('VIEW PROFILE');
                                    setOpenActionTypeDialog(false);
                                    setActionType('VIEW_PROFILE');
                                    setScannerOpen(true);
                                }}
                            >
                                VIEW PROFILE
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={movementTypeDialog}
                    onOpenChange={(open) => {
                        // Only allow opening programmatically.
                        // Ignore attempts to close from outside click or Esc.
                        if (open) {
                            setMovementTypeDialog(true);
                        }
                    }}
                >
                    <DialogContent
                        className="w-[80vw] md:max-w-[400px]"
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        showCloseButton={false}
                    >
                        <DialogHeader>
                            <DialogTitle>
                                {durationLabel(activeMode)}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => {
                                    setOpenActionTypeDialog(false);
                                    setScannerOpen(true);
                                    setMovementTypeDialog(false);
                                    setActiveMode('ASHORE');
                                }}
                            >
                                ASHORE
                            </Button>

                            <Button
                                onClick={() => {
                                    setActiveMode('ABOARD');
                                    setMovementTypeDialog(false);
                                    setScannerOpen(true);
                                }}
                            >
                                ABOARD
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* ABOARD CONFIRM */}
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Aboard</AlertDialogTitle>
                            <AlertDialogDescription className="w-full">
                                Mark{' '}
                                <span className="font-bold text-black">
                                    CCGNO {person?.last_name}
                                </span>{' '}
                                as aboard?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAboard}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* ASHORE FORM (UNCHANGED BACKEND ROUTE) */}
                <Dialog
                    open={openAshoreForm}
                    onOpenChange={(open) => {
                        // Only allow opening programmatically.
                        // Ignore attempts to close from outside click or Esc.
                        if (open) {
                            setOpenAshoreForm(true);
                            closeModal();
                        }
                    }}
                >
                    <DialogContent
                        className="w-[400px]"
                        showCloseButton={false}
                    >
                        <form onSubmit={submitAshore}>
                            <DialogHeader>
                                <DialogTitle>Ashore Details</DialogTitle>
                            </DialogHeader>

                            {/* Duration */}
                            <Select
                                value={data.duration}
                                onValueChange={(v) => setData('duration', v)}
                            >
                                <SelectTrigger className="my-3 w-full">
                                    <SelectValue placeholder="Select Duration" />
                                </SelectTrigger>

                                <SelectContent>
                                    {durationOptions.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Time */}
                            <Input
                                type="time"
                                value={data.time}
                                onChange={(e) =>
                                    setData('time', e.target.value)
                                }
                            />

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setOpenAshoreForm(false);
                                        setOpenActionTypeDialog(true);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* SCANNER */}

                {person && (
                    <Dialog
                        open={openPersonDialog}
                        onOpenChange={(open) => {
                            setOpenPersonDialog(open);
                            if (!open) {
                                // Instead of completely resetting everything,
                                // just transition right into the movement selection!
                                setOpenPersonDialog(false);
                                setOpenActionTypeDialog(true);
                            }
                        }}
                    >
                        <DialogContent className="max-h-[90dvh] max-w-[90vw] overflow-y-auto sm:max-w-[800px]">
                            <DialogClose asChild>
                                <button
                                    onClick={() => {
                                        setPerson(null);
                                        scanLockRef.current = false;

                                        router.visit('/scanner', {
                                            replace: true,
                                            preserveState: true,
                                        });
                                    }}
                                    className="absolute top-4 right-4"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </DialogClose>

                            <DialogHeader>
                                <DialogTitle>Trainee Details</DialogTitle>
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
                                            value={person?.coy ?? ''}
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
                                            value={person?.serial_number ?? ''}
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
                                            value={person?.religion ?? ''}
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
                                            value={person?.status ?? ''}
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
                                            value={person?.contact_no ?? ''}
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
                                            value={person?.emergency_contact_no}
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
                                            Blood Type
                                        </label>
                                        <input
                                            readOnly
                                            value={person?.blood_type}
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
                                            value={person?.hair_color}
                                            className="w-full rounded border bg-gray-100 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">
                                            Identifying Marks
                                        </label>
                                        <input
                                            readOnly
                                            value={person?.identifying_marks}
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

                                <Tabs02 movements={person?.movements || []} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {scannerOpen && (
                    <div className="flex justify-center">
                        <Scanner
                            key={scannerKey}
                            onScan={handleScan}
                            components={{
                                tracker: highlightCodeOnCanvas,
                                torch: true,
                                zoom: true,
                                finder: false,
                            }}
                            constraints={{
                                facingMode: 'environment',
                                width: { ideal: 1920 },
                                height: { ideal: 1080 },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
