"use client";
import { useSession } from "next-auth/react";
import Layout from "./component/Layout";
import ChartsLayout from "./component/ChartsLayout";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex xs:flex-col sm:flex-col md:flex-row justify-between session-contain">
        <h2>
          Hello , <b>{session?.user?.email}</b>
        </h2>
        <div className="flex bg-gray-200 text-black gap-1 rounded-full">
          <Image
            width={32}
            height={32}
            src={session?.user?.image}
            alt="user-image"
            className="w-8 h-8 rounded-full"
          />
          <span className="px-2 py-1 ">{session?.user?.name}</span>
        </div>
      </div>
      <ChartsLayout />
    </Layout>
  );
}
