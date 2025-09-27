import React, { useEffect, useState } from 'react';
import { Image } from '@/models/image';
import { fetchImagesByUsername } from '@/fetchFunctions/fetchImages';
import { convertISOToHumanReadable } from '@/utilityFunctions/dateTimeTranslations';

interface ImageTableWithFilterProps {
    username: string;
}

const ImageTableWithFilter: React.FC<ImageTableWithFilterProps> = ({ username }) => {
    const [images, setImages] = useState<Image[]>([]);

    const fetchFilteredImages = async () => {
        const data = await fetchImagesByUsername(username);
        setImages(data);
    };

    useEffect(() => {
        fetchFilteredImages();
    }, [username]);

    return (
        <div className="container mx-auto p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold mb-4">Image List</h1>
            {images.length === 0 ? (
                <p className="text-gray-500">No images found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700 border border-gray-600">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b border-gray-600">ID</th>
                                <th className="px-4 py-2 border-b border-gray-600">Uploaded By</th>
                                <th className="px-4 py-2 border-b border-gray-600">Image URL</th>
                                <th className="px-4 py-2 border-b border-gray-600">Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map((image) => (
                                <tr key={image.id} className="hover:bg-gray-600">
                                    <td className="px-4 py-2 border-b border-gray-600">{image.id}</td>
                                    <td className="px-4 py-2 border-b border-gray-600">{image.uploaded_by_username}</td>
                                    <td className="px-4 py-2 border-b border-gray-600">
                                        <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Image</a>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-600">{convertISOToHumanReadable(image.uploaded_on)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ImageTableWithFilter;
