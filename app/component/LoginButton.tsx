"use client";

import React from "react";
import {
  signIn as logIn,
  signOut as logOut,
  useSession,
} from "next-auth/react";
import { usePathname } from "next/navigation";

import { useCartStore } from "../store";

export const LoginButton = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const removeAllFromCart = useCartStore((state) => state.removeAll);
  const storeProgramName = useCartStore((state) => state.setProgramName);

  const cleanUp = () => {
    removeAllFromCart();
    storeProgramName("");
  };

  const isLoggedIn = !!session;
  const isLoading = status === "loading";

  const handleLoggingAction = () => {
    "use client";

    if (isLoggedIn) {
      cleanUp();
      logOut({
        callbackUrl: "/",
      });
      return;
    }
    logIn("google");
  };

  const isWorkoutCompletePage = pathname === "/my-programs/complete";
  const isIntroPage = pathname === "/";

  return !isWorkoutCompletePage ? (
    <button
      disabled={!!isLoading}
      className={`${
        isIntroPage ? "top-10 absolute right-10" : ""
      } btn-basic bg-black border-4 h-20 flex justify-center 
      items-center hover:bg-gray6 hover:border-black hover:text-black z-10`}
      onClick={handleLoggingAction}
    >
      {isLoading ? "loading!" : isLoggedIn ? "LOG OUT" : "JOIN NOW"}
    </button>
  ) : (
    <></>
  );
};
