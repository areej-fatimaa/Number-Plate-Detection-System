// components/Auth/Logout.tsx
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { useRouter } from "next/router";

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Logout
    </button>
  );
};

export default Logout;
