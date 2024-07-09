"use client";
import Image from "next/image";
import {
  signIn as logIn,
  signOut as logOut,
  useSession,
} from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;
  const isLoading = status === "loading";

  return (
    <div className="h-screen w-screen relative bg-black flex-col">
      <section className="flex">
        <div className="flex">
          <h1 className="text-[80px] text-stroke-4 text-stroke-black font-semibold">
            Build Your Body
          </h1>
          <input />
        </div>
      </section>
      <section>tags</section>
      <section>contents</section>
    </div>
  );
}
