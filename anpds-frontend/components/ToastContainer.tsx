import { ToastContainer } from "react-toastify"

export default ()=>{
    return<ToastContainer 
    position="top-right" 
    autoClose={5000} 
    hideProgressBar={false} 
    newestOnTop={false} 
    closeOnClick 
    rtl={false} 
    pauseOnFocusLoss 
    draggable 
    pauseOnHover
    theme="dark" // Set to dark theme
  />
}