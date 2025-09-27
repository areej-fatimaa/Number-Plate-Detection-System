import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false, // Show progress bar
      theme: "dark",
      progressStyle: { background: '#F44336' }, // Red progress bar for error
    });
  };
  