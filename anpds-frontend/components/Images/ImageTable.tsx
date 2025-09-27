import React, { useEffect, useState } from 'react';
import { Image } from '@/models/image';
import { fetchImages } from '@/fetchFunctions/fetchImages';
import { convertISOToHumanReadable } from '@/utilityFunctions/dateTimeTranslations';

const ImageTable: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);

    useEffect(() => {
        const getImages = async () => {
            const data = await fetchImages();
            setImages(data);
        };

        getImages();
    }, []);  

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Image List</h1>
            {images.length === 0 ? (
                <p className="text-gray-500">No images found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">ID</th>
                                <th className="px-4 py-2 border-b">Uploaded By</th>
                                <th className="px-4 py-2 border-b">Image URL</th>
                                <th className="px-4 py-2 border-b">Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map((image) => (
                                <tr key={image.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b">{image.id}</td>
                                    <td className="px-4 py-2 border-b">{image.uploaded_by_username}</td>
                                    <td className="px-4 py-2 border-b">
                                        <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Image</a>
                                    </td>
                                    <td className="px-4 py-2 border-b">{convertISOToHumanReadable(image.uploaded_on)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ImageTable;
