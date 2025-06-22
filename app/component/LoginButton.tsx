"use client";

import React from "react";
import {
  signIn as logIn,
  signOut as logOut,
  useSession,
} from "next-auth/react";
import { usePathname } from "next/navigation";

import { useCartStore, useProgressStore } from "../store";

export const LoginButton = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const removeAllFromCart = useCartStore((state) => state.removeAll);
  const storeProgramName = useCartStore((state) => state.setProgramName);
  const resetProgramInfo = useProgressStore((state) => state.resetProgramInfo);
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const resetExercisesStatus = useProgressStore(
    (state) => state.resetExercisesStatus
  );
  const resetCompletedAt = useProgressStore((state) => state.resetCompletedAt);

  const clearStorages = () => {
    // cart
    removeAllFromCart();
    storeProgramName("");

    // performance and summary
    resetProgramInfo();
    resetWorkoutTime();
    resetExercisesStatus();
    resetCompletedAt();
  };

  const isLoggedIn = !!session;
  const isLoading = status === "loading";

  const handleLoggingAction = () => {
    "use client";

    if (isLoggedIn) {
      clearStorages();
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
        isIntroPage
          ? "top-10 absolute right-14 sm:right-24"
          : "mr-5 sm:mr-12 md:mr-0"
      } btn-basic bg-black border-4 h-20 flex justify-center 
      transition-all ease-in-out duration-300 scale-75 sm:scale-100
      items-center hover:bg-gray6 hover:border-black hover:text-black z-10`}
      onClick={handleLoggingAction}
    >
      {isLoading ? "loading!" : isLoggedIn ? "LOG OUT" : "JOIN NOW"}
    </button>
  ) : (
    <></>
  );
};
