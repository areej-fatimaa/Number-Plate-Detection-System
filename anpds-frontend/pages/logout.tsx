import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config"; // Ensure correct path

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        router.push("/sign-in"); // Redirect to sign-in page after logout
      } catch (error: any) {
        console.error("Error signing out:", error.message);
        setError("An error occurred while logging out. Please try again.");
      } finally {
        setLoading(false); // Stop loading once the operation is complete
      }
    };

    logout();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Logging out...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return null;
}
