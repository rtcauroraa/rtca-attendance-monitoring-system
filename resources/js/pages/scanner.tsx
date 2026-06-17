import React, { Component, useRef, useState } from 'react';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

export default function scanner() {
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
    const closeModal = () => {
        setModalOpen(false);
        setPerson(null);
        setType(null);

        scanLockRef.current = false;

        lastQRRef.current = null;

        setTimeout(() => {
            setScannerKey((prev) => prev + 1); // 🔥 fully resets scanner engine
        }, 300);
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
                                      ? `CCGNO ${person.first_name ?? ''} ${person.middle_name ?? ''} ${person.last_name ?? ''}`.trim()
                                      : 'No Data Found'}
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
                                        <Button>LIBERTY</Button>
                                        <Button>LEAVE</Button>
                                        <Button>OB</Button>
                                        <Button variant="outline">
                                            VIEW PROFILE
                                        </Button>
                                    </>
                                )}

                                {type === 'Personnel' && (
                                    <Button variant="outline">
                                        VIEW PROFILE
                                    </Button>
                                )}
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
