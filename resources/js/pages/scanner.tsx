import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

export default function QrScanner() {
    const [scanResult, setScanResult] = useState(null);
    const [backendResponse, setBackendResponse] = useState('');

    useEffect(() => {
        // Initialize scanner matching the container ID
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        const onSuccess = (decodedText) => {
            scanner.clear(); // Stop scanning after success
            setScanResult(decodedText);
            sendDataToLaravel(decodedText);
        };

        const onError = (err) => {
            // Constantly logs searching frames; suppress or handle gently
            console.warn(err);
        };

        scanner.render(onSuccess, onError);

        // Clean up the scanner instance on unmount
        return () => {
            scanner
                .clear()
                .catch((error) =>
                    console.error('Failed to clear scanner', error),
                );
        };
    }, []);

    const sendDataToLaravel = async (data) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/verify-qr',
                {
                    qr_code: data,
                },
            );
            setBackendResponse(response.data.message);
        } catch (error) {
            setBackendResponse(
                error.response?.data?.message || 'Server error occurred',
            );
        }
    };

    return (
        <div
            style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}
        >
            <h2>QR Code Scanner</h2>
            <div id="reader"></div>
            {scanResult && (
                <p>
                    Scanned Code: <strong>{scanResult}</strong>
                </p>
            )}
            {backendResponse && (
                <p>
                    Backend Response: <strong>{backendResponse}</strong>
                </p>
            )}
        </div>
    );
}
