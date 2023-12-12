"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import { useSession, signIn, signOut } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { status } = useSession();

  console.log(status);
  return (
    <main className={`pt-4 ${inter.className}`}>
      LOGIN
      <div>
        {status === "authenticated" ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </div>
    </main>
  );
}
