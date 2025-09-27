"use client"

import BackButtonHeader from '@/components/BackButtonHeader';
import ImageGallery from '@/components/Images/ImageGallery';
import { getActiveUser } from '@/fetchFunctions/Getters';
import { useRouter } from 'next/router';

const Example = () => {
    const router = useRouter();
    return (
        <div className="p-8 mx-auto bg-gray-800">
            <BackButtonHeader path="/Dashboard"/>
            <ImageGallery username={getActiveUser() ?? ''} />
        </div>
    );
};

export default Example;