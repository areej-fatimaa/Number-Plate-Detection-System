import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase-config"; 
import BackButtonHeader from "@/components/BackButtonHeader";
import { convertISOToHumanReadable } from "@/utilityFunctions/dateTimeTranslations";

export default function ViewProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in"); 
      } else {
        setUser(currentUser); 
        const userRef = doc(firestore, "user", currentUser.email ?? ""); 
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          
          const formattedData = {
            ...data,
            endDate: data.endDate,
            Last_Uploaded: data.Last_Uploaded?.toDate().toLocaleDateString() 
          };
          
          setUserDetails(formattedData); 
        } else {
          console.log("No such user data!");
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  console.log(userDetails);

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-800 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <BackButtonHeader path="/Dashboard" />
      <div className="max-w-lg mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl mb-6">Your Profile</h1>
        <p className="text-lg mb-4">Email: {user?.email}</p>

        {userDetails && (
          <div>
            <p className="text-lg mb-4">Plan: {userDetails.plan}</p>
            <p className="text-lg mb-4">Image upload Limit today: {userDetails.Today_Limit}</p>
            <p className="text-lg mb-4">Image upload limit: {userDetails.Upload_Limit}</p>
            <p className="text-lg mb-4">Subscription End Date: {convertISOToHumanReadable(userDetails.endDate)}</p>
            <p className="text-lg mb-4">Last Upload: {userDetails.Last_Uploaded}</p>
          </div>
        )}

        <button className="w-full p-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 mb-4">
          Reset Password
        </button>

        <button
          onClick={() => {
            signOut(auth);
            router.push("/sign-in");
          }}
          className="mt-4 p-2 bg-red-600 text-white rounded-md w-full hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
