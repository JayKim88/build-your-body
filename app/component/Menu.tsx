"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu = () => {
  const currentPath = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const isLoading = status === "loading";

  const isSelectedItem = (target: string) =>
    currentPath === target ? "text-yellow" : "text-inherit";

  return isLoading ? (
    <></>
  ) : (
    <div className="flex flex-row-reverse bg-black text-white h-fit w-fit rounded-r-3xl absolute top-1/2 -translate-y-1/2 z-10 border-white border-2 border-l-0">
      <div className="flex justify-start items-center peer w-[30px]">
        <div className="relative w-[18px] h-[30px]">
          <Image
            src="/arrow-right.svg"
            alt="arrow right"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
      <ul className="w-[0px] invisible peer-hover:visible peer-hover:w-[200px] pl-2 flex overflow-hidden flex-col justify-evenly text-2xl hover:visible hover:w-[200px] transition-all duration-500 ease-in-out [&>li]:w-[200px] [&>li]:h-[77.5px] [&>li]:flex [&>li]:items-center [&>li:hover]:text-yellow">
        <li
          className={isSelectedItem("/exercises")}
          style={{
            verticalAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link href="/exercises">Exercises</Link>
        </li>
        {isLoggedIn && (
          <>
            <li className={isSelectedItem("/my-programs")}>
              <Link href="/my-programs">My Programs</Link>
            </li>
            <li className={isSelectedItem("/my-stats")}>
              <Link href="/my-stats">My Stats</Link>
            </li>
          </>
        )}
        <li className={isSelectedItem("/communities")}>
          <Link href="/communities">Communities</Link>
        </li>
      </ul>
    </div>
  );
};

export { Menu };
