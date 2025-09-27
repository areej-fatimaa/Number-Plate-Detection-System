import { convertISOToHumanReadable } from '@/utilityFunctions/dateTimeTranslations';
import axios from 'axios';
import React, { useState, useEffect } from "react";

interface CardProps {
    imageUrl: string;
    uploadedDate: string;
    imageid: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, uploadedDate, imageid }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
        const checkIfScanned = async () => {
            try {
                const checkScanResponse = await axios.get(`http://127.0.0.1:8000/api/images/status/${imageid}/`);
                if (checkScanResponse.data.status === 'success' && checkScanResponse.data.scanned) {
                    setResult(checkScanResponse.data.scan_data);
                    setScanned(true);  // Mark the image as scanned
                }
            } catch (err) {
                console.error(err);
                setError('Error checking scan status.');
            }
        };

        checkIfScanned();
    }, [imageid]);

    const handleObjectDetection = async () => {
        console.log("Image URL:", imageUrl);
        setLoading(true);
        setError(null);  // Clear previous errors

        if (!imageUrl) {
            setError('Image URL is missing!');
            setLoading(false);
            return;
        }

        try {
            // If the image is not scanned yet, continue with scanning
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();

            const formData = new FormData();
            formData.append('image', imageBlob, 'uploaded-image.jpg');
            formData.append('imageid', imageid);

            // Send the image to the backend for scanning
            const response = await axios.post('http://127.0.0.1:8000/scan/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'success') {
                setResult(response.data.data);  // Store the detection results
                setScanned(true);  // Mark the image as scanned
            } else {
                setError(response.data.message || 'Unexpected error occurred.');
            }
        } catch (err) {
            setError('Error during object detection. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowScan = () => {
        // Show the scan results if available
        if (result) {
            alert(JSON.stringify(result, null, 2));  // Or render it as you prefer
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <img src={imageUrl} alt="Card Image" className="w-full h-auto" />
            <div className="flex justify-between items-center p-2.5 bg-gray-100">
                <span className="text-sm text-gray-600">{convertISOToHumanReadable(uploadedDate)}</span>
                <button
                    onClick={scanned ? handleShowScan : handleObjectDetection}
                    className="px-2.5 py-1 text-sm text-white bg-blue-500 border-none rounded cursor-pointer"
                    disabled={loading}
                >
                    {loading ? 'Detecting...' : scanned ? 'Show Scan' : 'Scan Image'}
                </button>
            </div>

            {result && !scanned && (
                <div className="p-2.5 bg-gray-200 mt-2">
                    <p className="text-sm font-semibold">Scanned Data:</p>
                    <pre className="text-xs bg-white p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="p-2.5 bg-red-100 text-red-700 mt-2 rounded">
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default Card;
