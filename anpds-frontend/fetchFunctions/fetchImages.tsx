import axios from "axios";
import { API_IMAGES } from "@/API_Endpoints";
import { Image } from "@/models/image";

export const fetchImages = async (): Promise<Image[]> => {
    try {
        const response = await axios.get<Image[]>(`${API_IMAGES}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};

export const fetchImagesByUsername = async (username:string): Promise<Image[]> => {
    try {
        const response = await axios.get<Image[]>(`${API_IMAGES}filter?username=${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};