import { useState } from "react";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { setActiveUser } from "@/fetchFunctions/Setters";
import { createUser } from "@/fetchFunctions/FirebaseUserModificationFunctions";
import ToastContainer from "@/components/ToastContainer";
import LoadingSpinner from "../LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";
import { ErrorToast } from "../ErrorToast";
import { toast } from "react-toastify";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const router = useRouter();

  // Email/password sign-up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.email;

      if (!userId) throw new Error("User ID is null or undefined");

      await createUser(userId);
      setActiveUser(userId);
      setIsSignUpSuccess(true);
      await sendEmailVerification(userCredential.user);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      if (error.code === "auth/email-already-in-use") {
        ErrorToast("This email is already registered.");
      } else {
        ErrorToast("Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Email verification check
  const handleVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsEmailVerified(true);
          toast.success("Email verified!");
          router.push("/Dashboard");
        } else {
          ErrorToast("Email not verified yet. Check your inbox.");
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error.message);
      ErrorToast("Failed to verify email.");
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        toast.success("Verification email resent.");
      }
    } catch (error: any) {
      console.error("Resend error:", error.message);
      ErrorToast("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  // Google sign-up
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userId = result.user.email;

      if (!userId) throw new Error("Google sign-in failed");

      await createUser(userId);
      setActiveUser(userId);
      router.push("/Dashboard");
    } catch (error: any) {
      console.error("Google Sign-up error:", error.message);
      ErrorToast("Google sign-up failed.");
    } finally {
      setLoading(false);
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

      <h1 className="text-3xl text-center text-white mb-6">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          Sign Up
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>
      </div>

      {isSignUpSuccess && !isEmailVerified && (
        <div className="mt-6 space-y-3">
          <p className="text-gray-300 text-sm">
            A verification email has been sent to <span className="font-semibold">{email}</span>.
          </p>
          <button
            onClick={handleVerification}
            disabled={loading}
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            I've Verified My Email
          </button>
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full p-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Resend Verification Email
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-gray-300">
        Already have an account? <a href="/sign-in" className="text-blue-400 hover:underline">Sign In</a>
      </div>

      <ToastContainer />
    </div>
  );
}
