import React from 'react';
import ImageUpload from '../components/Images/ImageUpload'; 
import { useRouter } from 'next/router';
import BackButtonHeader from '@/components/BackButtonHeader';

const UploadImage = () => {
  const router = useRouter();
  return (
    <div className='h-full max-h-screen'>
      <BackButtonHeader path="/Dashboard"/>
      <ImageUpload />
    </div>
  );
};

export default UploadImage;