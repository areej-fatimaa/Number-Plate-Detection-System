import { fetchImagesByUsername } from "@/fetchFunctions/fetchImages";
import Card from "./Card";
import React, { useEffect, useState } from "react";
import { Image } from "@/models/image";
import { useRouter } from "next/router";
import LoadingSpinner from "../LoadingSpinner";

interface ImageGalleryProps {
    username: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ username }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const fetchedImages = await fetchImagesByUsername(username);
                setImages(fetchedImages);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [username]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg text-gray-500 mb-4">You haven't uploaded any images.</p>
                <button
                    onClick={() => router.push("/uploadImage")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Upload Images
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <div key={index} className="relative">
                    <Card uploadedDate={image.uploaded_on} imageUrl={image.url} imageid={image.id}/>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
