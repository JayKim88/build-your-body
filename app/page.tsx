"use client";
import Image from "next/image";
import { Button } from "./component/Button";
import { Menu } from "./component/Menu";
import {
  signIn as logIn,
  signOut as logOut,
  useSession,
} from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;
  const isLoading = status === "loading";

  const handleLoggingAction = () => {
    "use client";

    return isLoggedIn ? logOut() : logIn("google");
  };

  return (
    <div className="h-screen w-screen relative bg-[url('/landing.jpg')] bg-cover bg-center">
      <Button
        customStyles="bg-black border-4 absolute top-10 right-10 h-20 flex justify-center items-center hover:bg-gray6 hover:border-black hover:text-black"
        onClick={handleLoggingAction}
        disabled={isLoading}
      >
        {isLoading ? "loading!" : isLoggedIn ? "LOG OUT" : "JOIN NOW"}
      </Button>
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[7rem] text-stroke-4 text-stroke-black font-semibold">
        Build Your Body
      </h1>
      <Menu />
    </div>
  );
}
