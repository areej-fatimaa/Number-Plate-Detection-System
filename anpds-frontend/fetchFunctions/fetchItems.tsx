 import axios from 'axios';
import Item from '../models/item';
import { API_BASE } from '@/constant';

const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await axios.get<{ id: number; name: string; description: string }[]>(`${API_BASE}/items/`);
    return response.data.map(
      (item) => new Item(item.id, item.name, item.description)
    );
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export default fetchItems;
