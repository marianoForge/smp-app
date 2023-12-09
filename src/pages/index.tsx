import Image from "next/image";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <main className={`pt-4 ${inter.className}`}>HOME</main>;
}
