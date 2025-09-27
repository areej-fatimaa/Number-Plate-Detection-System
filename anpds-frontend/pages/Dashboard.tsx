import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { setActiveUser } from "@/fetchFunctions/Setters";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in"); 
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  function handleSignOut(){
    signOut(auth);
    setActiveUser("");
    router.push("/sign-in");
  }

  if (!user) return <div>Loading...</div>; // hydration resolver

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <p>You're logged in!</p>

      <div className="mt-4">
          <button className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
            onClick={()=>router.push("/uploadImage")}>
            Upload Image
          </button>

          <button className="w-full p-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 mb-4" 
            onClick={()=>router.push("/Gallery")}>
            Gallery
          </button>

          <button className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 mb-4"
          onClick={()=>router.push("/ViewProfile")}>
          Your Profile
          </button>

      </div>

      <button
        onClick={handleSignOut}
        className="mt-4 p-2 bg-red-600 text-white rounded-md w-full"
      >
        Log Out
      </button>
    </div>
  );
}