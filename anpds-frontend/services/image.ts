import axios from 'axios';
import { API_IMAGES } from '@/API_Endpoints';

interface ImageUploadData {
    username: string;
    file: File;
}

interface UploadResponse {
    id: string;  // Assuming 'id' is of type string, adjust if necessary
}

export const handleSubmit = async (
    data: ImageUploadData,
    setResponseMessage: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('image', data.file);

    try {
        const response = await axios.post<UploadResponse>(`${API_IMAGES}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setResponseMessage(`Image uploaded successfully! ID: ${response.data.id}`);
    } catch (error) {
        setResponseMessage('Error uploading image');
    } finally {
        setIsLoading(false);
    }
};
