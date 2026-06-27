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
    DialogContent,
    DialogDescription,
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
import { AlertCircle, TriangleAlertIcon } from 'lucide-react';

export default function ScannerPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [person, setPerson] = useState<any>(null);
    const [type, setType] = useState<string | null>(null);

    const scanLockRef = useRef(false);
    const lastQRRef = useRef<string | null>(null);
    const [scannerKey, setScannerKey] = useState(0);

    // 🔥 ACTION TYPE (LIBERTY / LEAVE / OFFICIAL BUSINESS)
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const [openActionDialog, setOpenActionDialog] = useState(true);
    const [openAshoreForm, setOpenAshoreForm] = useState(false);

    const [pendingAboardId, setPendingAboardId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [ashoreID, setAShoreID] = useState(null);

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
        setType(null);
        setActiveAction(null);
        setScannerOpen(false);
        setAShoreID(null);
        reset();

        scanLockRef.current = false;
        lastQRRef.current = null;

        setOpenAshoreForm(false);
        setOpenActionDialog(false);
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
            `/trainee-movement/${person.trainee_id}`,
            {
                type: activeAction, // LIBERTY | LEAVE | OFFICIAL_BUSINESS
                mode: 'ASHORE',
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
                type: activeAction,
                mode: 'ABOARD',
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Trainee returned successfully.');
                    closeModal();
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
                    }
                },
            },
        );
    };
    const [activeMode, setActiveMode] = useState<'ASHORE' | 'ABOARD' | null>(
        null,
    );
    const [scannerOpen, setScannerOpen] = useState(false);
    const handleScan = (results: any) => {
        closeModal();
        setNotFoundDialogOpen(false);
        const raw = results?.[0]?.rawValue;
        if (!raw) return;

        if (scanLockRef.current) return;
        scanLockRef.current = true;

        const [type, id] = raw.split('_');

        if (activeMode === 'ASHORE') {
            setAShoreID(id);
            setOpenAshoreForm(true);
        } else {
            setConfirmOpen(true);
        }

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
                    } else {
                        setConfirmOpen(true);
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
                    open={openActionDialog}
                    onOpenChange={(open) => {
                        // Only allow opening programmatically.
                        // Ignore attempts to close from outside click or Esc.
                        if (open) {
                            setOpenActionDialog(true);
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
                                {durationLabel(activeAction)}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => {
                                    setActiveMode('ASHORE');
                                    setOpenActionDialog(false);
                                    setScannerOpen(true);
                                }}
                            >
                                Ashore
                            </Button>

                            <Button
                                onClick={() => {
                                    setActiveMode('ABOARD');
                                    setOpenActionDialog(false);
                                }}
                            >
                                Aboard
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* ABOARD CONFIRM */}
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Aboard</AlertDialogTitle>
                            <AlertDialogDescription>
                                Mark trainee as aboard?
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
                <Dialog open={openAshoreForm} onOpenChange={setOpenAshoreForm}>
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
                                    onClick={() => setOpenAshoreForm(false)}
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
