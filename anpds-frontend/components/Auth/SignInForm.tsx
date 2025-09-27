import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { setActiveUser } from "@/fetchFunctions/Setters";
import ToastContainer from "@/components/ToastContainer";
import LoadingSpinner from "../LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";
import { ErrorToast } from "../ErrorToast";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import { emailJsConfig } from "../../firebase/firebase-config"; // Your Email.js config

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendEmail, setResendEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store generated OTP here
  const router = useRouter();

  // Send OTP email using Email.js
  const sendOtpEmail = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

    // Send OTP via Email.js
    const templateParams = {
      email: email,
      otp: otp,
    };

    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        templateParams,
        emailJsConfig.userId
      );
      toast.success("OTP sent to your email.");
      setOtpSent(true);
      setGeneratedOtp(otp); // Store OTP for later verification
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP.");
    }
  };

  // Email/password sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setEmailVerified(false);
        setResendEmail(true);
        ErrorToast("Please verify your email before proceeding.");
        return;
      }

      // Send OTP after successful login
      if (user.email) {
        await sendOtpEmail(user.email);
      } else {
        throw new Error("User email is null.");
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      if (error.code === "auth/user-not-found") {
        ErrorToast("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        ErrorToast("Incorrect password.");
      } else {
        ErrorToast("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification
  const handleOtpVerification = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      toast.success("OTP verified successfully. Redirecting to your dashboard...");
      router.push("/Dashboard");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <LoadingSpinner />
          <p className="mt-2 text-white text-sm">Processing...</p>
        </div>
      )}

      <h1 className="text-3xl text-center text-white mb-6">Sign In</h1>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </form>

      {otpSent && !otpVerified && (
        <div className="mt-6">
          <p className="text-white">Enter the OTP sent to your email:</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full p-3 bg-gray-700 text-white rounded-md mt-2"
          />
          <button
            onClick={handleOtpVerification}
            className="w-full p-3 bg-green-600 text-white rounded-md mt-4"
          >
            Verify OTP
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-gray-300">
        Don't have an account? <a href="/sign-up" className="text-blue-400 hover:underline">Sign Up</a>
      </div>

      <ToastContainer />
    </div>
  );
}
