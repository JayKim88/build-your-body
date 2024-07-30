"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

import { useCartStore } from "../store";
import { MakeProgramModal } from "./MakeProgramModal";

export const CartButton = () => {
  const cartItems = useCartStore((state) => state.stored);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isExercisesPage = pathname === "/exercises";
  const isLoggedIn = !!session;

  const Count = () => {
    return (
      <div className="absolute left-[16px] top-[-8px] w-6 h-6 rounded-[24px] bg-yellow flex items-center justify-center text-black pt-0.5">
        {cartItems.length}
      </div>
    );
  };

  return isLoggedIn && isExercisesPage ? (
    <>
      <div
        className={`absolute top-14 right-60 z-10 hover:cursor-pointer ${
          !cartItems.length && "pointer-events-none"
        }`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Count />
        <FontAwesomeIcon
          icon={faCartShopping}
          fontSize={48}
          height={48}
          width={48}
        />
      </div>
      <MakeProgramModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  ) : (
    <></>
  );
};
