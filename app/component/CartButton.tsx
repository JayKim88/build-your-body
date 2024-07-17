"use client";

import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export const CartButton = () => {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;

  const itemsCount = 5;

  const Count = () => {
    return (
      <div className="absolute left-[16px] top-[-8px] w-6 h-6 rounded-[24px] bg-yellow flex items-center justify-center text-black pt-0.5">
        {itemsCount}
      </div>
    );
  };

  return isLoggedIn ? (
    <div className="absolute top-14 right-60 z-10 hover:cursor-pointer">
      <Count />
      <FontAwesomeIcon
        icon={faCartShopping}
        fontSize={48}
        height={48}
        width={48}
      />
    </div>
  ) : (
    <></>
  );
};
