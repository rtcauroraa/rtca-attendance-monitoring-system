import React, { Component, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function scanner() {
    const handleScan = (detectedCodes: any) => {
        console.log('Detected codes:', detectedCodes);
        // detectedCodes is an array of IDetectedBarcode objects
        detectedCodes.forEach((code: any) => {
            console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
        });
    };

    // 1. Declare the state variable
    const [text, setText] = useState('');

    // 2. Handle the change event
    const handleChange = (event: any) => {
        setText(event.target.value);
    };
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
        <div>
            <h1>QR CODE Scanner</h1>
            <div className="mx-auto my-4 max-w-sm rounded-lg bg-white p-6 shadow-md">
                <Scanner
                    onScan={handleScan}
                    onError={(error) => console.error(error)}
                    components={{
                        tracker: highlightCodeOnCanvas,
                        finder: false,
                    }}
                />
            </div>

            <h1>QR CODE Generator</h1>
            <div className="bg-white px-2 py-2 text-black">
                <Field>
                    <FieldLabel htmlFor="input-field-qrcodeinput">
                        Enter Text
                    </FieldLabel>
                    <Input
                        id="input-field-qrcodeinput"
                        type="text"
                        value={text}
                        onChange={handleChange}
                        placeholder="Enter your qrcodeinput"
                    />
                    <FieldDescription>
                        Please enter text for QR CODE generator.
                    </FieldDescription>
                </Field>

                <QRCode value={text} />
            </div>
        </div>
    );
}
