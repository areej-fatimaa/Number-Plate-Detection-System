import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false, // Show progress bar
      theme: "dark",
      progressStyle: { background: '#4CAF50' }, // Green progress bar for success
    });
  };
  
  