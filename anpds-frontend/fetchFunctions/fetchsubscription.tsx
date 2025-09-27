import axios from 'axios';

export const fetchSubscription = async (userId: number) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/subscriptions/', { params: { user_id: userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};
