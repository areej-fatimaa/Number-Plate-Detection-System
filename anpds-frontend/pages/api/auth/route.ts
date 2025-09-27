// pages/api/auth/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase-config";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authAction, email, password } = req.body;

  try {
    if (authAction === "sign-up") {
      // Sign up the user
      await createUserWithEmailAndPassword(auth, email, password);
      res.status(200).json({ message: "User created successfully!" });
    } else if (authAction === "sign-in") {
      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      res.status(200).json({ message: "Signed in successfully!" });
    } else {
      res.status(400).json({ message: "Invalid authentication action!" });
    }
  } catch (error: any) {
    // Check if the error has a 'message' or 'code' property to handle it
    const errorMessage = error?.message || error?.code || "Authentication failed!";
    res.status(500).json({ message: errorMessage });
  }
};
