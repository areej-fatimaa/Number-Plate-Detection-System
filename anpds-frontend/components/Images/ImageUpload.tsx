import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getActiveUser } from '@/fetchFunctions/Getters';
import { handleSubmit } from '@/services/image';  
import { getTodayLimit, decrementTodayLimit, setLastUploaded } from '@/fetchFunctions/FirebaseUserModificationFunctions'; 

interface Image {
    id: string;
    uploaded_by_user: string;
    url: string;
    uploaded_on_date: string;
}

const ImageUpload: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>(getActiveUser() ?? "");
    const [files, setFiles] = useState<File[]>([]);  
    const [responseMessages, setResponseMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [todayLimit, setTodayLimit] = useState<number>(0);  
    const [decrementing, setDecrementing] = useState<boolean>(false);

    React.useEffect(() => {
        const fetchLimit = async () => {
            const limit = await getTodayLimit(username);
            setTodayLimit(limit || 0);  
        };
        fetchLimit();
    }, [username]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length) {
            setFiles(selectedFiles);
            setUploadProgress(0); 
        }
    };

    const validateFile = (file: File): string | null => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 20 * 1024 * 1024; // 20 MB

        if (!validTypes.includes(file.type)) {
            return 'File type must be PNG or JPEG';
        }

        if (file.size > maxSize) {
            return 'File size must be less than 20 MB';
        }

        return null;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (todayLimit <= 0) {
            setResponseMessages(['You have reached your upload limit for today.']);
            return;
        }

        if (files.length === 0) {
            setResponseMessages(['Please select at least one image file']);
            return;
        }
    
        setResponseMessages([]); 
        setIsLoading(true);
    
        const messages: string[] = [];
    
        for (const file of files) {
            const validationError = validateFile(file);
            if (validationError) {
                messages.push(validationError);
                continue;
            }
    
            const data = { username, file };
    
            await handleSubmit(
                data,
                async (messageOrUpdater) => {
                    const message =
                        typeof messageOrUpdater === 'function'
                            ? messageOrUpdater('') 
                            : messageOrUpdater;
                    messages.push(message);
                    console.log(messages);
                    console.log("hi");

                    if (message.includes('successfully')) {
                        setDecrementing(true);
                        await decrementTodayLimit(username);  
                        await setLastUploaded(username); 
                        setTodayLimit((await getTodayLimit(username)));
                        setDecrementing(false);
                    }
                },
                setIsLoading
            );

            setUploadProgress((prevProgress) => prevProgress + 1);
            if(uploadProgress>=files.length)setUploadProgress(0);
        }
    
        setResponseMessages(messages);
        setIsLoading(false);
    };
    
    return (
        <div className="bg-gray-800 flex items-center justify-center p-4 min-h-screen">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md relative flex flex-col h-full">
                
                <h1 className="text-white text-2xl mb-4">Upload Images</h1>
                
                <p className="text-white mb-4">
                    You have {todayLimit} upload(s) remaining today.
                </p>

                <form onSubmit={onSubmit} className="flex flex-col flex-grow">
                    <div className="mb-4 flex-grow">
                        <label htmlFor="files" className="block text-white mb-2">Choose Images:</label>
                        <input
                            type="file"
                            id="files"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            required
                            disabled={isLoading || decrementing}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                        />
                    </div>
                    <button type="submit" disabled={isLoading || decrementing || todayLimit <= 0} className="w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                        {(isLoading || decrementing) ? 'Uploading...' : 'Upload Images'}
                    </button>
                </form>

                {((isLoading || decrementing) && uploadProgress<files.length) && (
                    <p className="text-white mt-4">
                        Uploading {uploadProgress + 1} of {files.length} images...
                    </p>
                )}

                {responseMessages.length > 0 && (
                    <ul className="mt-4">
                        {responseMessages.map((msg, index) => (
                            <li key={index} className="text-white">{msg}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
