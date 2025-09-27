"use client"

import { useEffect, useState } from 'react';
import fetchItems from '../fetchFunctions/fetchItems';
import ImageUpload from '@/components/Images/ImageUpload';
import Item from '../models/item';
import ImageGallery from '@/components/Images/ImageGallery';
import ImageTableWithFilter from '@/components/Images/ImageTableByUsername';

const Example = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getItems = async () => {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    };

    getItems();
  }, []);

  return (
    <div className="p-8 mx-auto bg-gray-800">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">
      Welcome to the Item List
      </h1>
      <input 
      type="text" 
      placeholder="Enter username" 
      value={username} 
      onChange={(e) => setUsername(e.target.value)} 
      className="mb-4 p-2 border border-gray-300 text-black rounded"
      />
      {
        username!=="" && <>
      <ImageGallery username={username} />
      <ImageTableWithFilter username={username} />
      <ImageUpload />
        </>
      }
    </div>
  );
};

export default Example;