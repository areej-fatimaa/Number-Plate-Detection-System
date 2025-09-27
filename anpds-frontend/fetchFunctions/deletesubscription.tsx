// fetchFunctions/deleteSubscription.ts
import axios from 'axios';

export const deleteSubscription = async (subscriptionId: number) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/subscriptions/${subscriptionId}/delete/`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting subscription: ${error}`);
  }
};
