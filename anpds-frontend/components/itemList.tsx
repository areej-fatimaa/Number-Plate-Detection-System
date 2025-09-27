import React from 'react';
import Item from '../models/item';

interface ItemListProps {
  items: Item[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Items</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;