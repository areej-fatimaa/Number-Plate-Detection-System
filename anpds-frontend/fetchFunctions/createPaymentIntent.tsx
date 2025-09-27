import axios from 'axios';
import { getActiveUser } from './Getters';

export const createPaymentIntent = async (plan: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/create-payment-intent/', {
      user_id:getActiveUser(),
      plan_name: plan,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
