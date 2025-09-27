"use client";

import { Roboto } from "next/font/google";
import "./globals.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page
    router.push("/sign-in");
  }, [router]);

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className="w-screen h-screen flex justify-center items-center">
          <h1>Loading...</h1>
        </div>
      </body>
    </html>
  );
}
