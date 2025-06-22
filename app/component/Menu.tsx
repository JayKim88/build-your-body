"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SpinLoader } from "./SpinLoader";

const pathNames = {
  home: "/",
  exercises: "/exercises",
  myPrograms: "/my-programs",
  myStats: "/my-stats",
  communities: "/communities",
};

export const Menu = () => {
  const currentPath = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const isLoading = status === "loading";
  const [pageChange, setPageChange] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSelectedItem = (target: string) =>
    currentPath === target ? "text-yellow" : "text-inherit";

  useEffect(() => {
    setPageChange(false);
    setMobileOpen(false); // close mobile menu on route change
  }, [currentPath]);

  const handlePageChange = (pathName: string) => {
    if (currentPath === pathName) return;
    setPageChange(true);
  };

  const linkProps = (pathName: string) => ({
    href: pathName,
    onClick: () => handlePageChange(pathName),
    scroll: false,
  });

  const { exercises, myPrograms, myStats, communities, home } = pathNames;

  if (isLoading) return null;

  return (
    <>
      <div
        className="hidden sm:flex flex-row-reverse bg-black text-white h-fit w-fit 
        rounded-r-3xl fixed top-1/2 -translate-y-1/2 z-20 border-white border-2 
        border-l-0"
      >
        <div className="flex justify-start items-center peer w-[30px]">
          <div className="relative w-[18px] h-[30px]">
            <Image
              src="/arrow-right.svg"
              alt="Expand navigation menu"
              fill
              style={{ objectFit: "contain" }}
              sizes="18px"
              loading="lazy"
            />
          </div>
        </div>
        <ul
          className="w-[0px] invisible peer-hover:visible peer-hover:w-[200px] 
          pl-2 flex overflow-hidden flex-col justify-evenly text-2xl hover:visible 
          hover:w-[200px] transition-all duration-500 ease-in-out [&>li]:w-[200px] 
          [&>li]:h-[77.5px] [&>li]:flex [&>li]:items-center [&>li:hover]:text-yellow 
          relative"
        >
          {pageChange && <SpinLoader />}
          <li className={isSelectedItem(exercises)}>
            <Link {...linkProps(exercises)}>Exercises</Link>
          </li>
          {isLoggedIn && (
            <>
              <li className={isSelectedItem(myPrograms)}>
                <Link {...linkProps(myPrograms)}>My Programs</Link>
              </li>
              <li className={isSelectedItem(myStats)}>
                <Link {...linkProps(myStats)}>My Stats</Link>
              </li>
            </>
          )}
          <li className={isSelectedItem(communities)}>
            <Link {...linkProps(communities)}>Communities</Link>
          </li>
        </ul>
      </div>
      <button
        className="fixed bottom-6 right-6 z-[19] sm:hidden bg-black text-white 
        rounded-full p-3 shadow-lg border-gray6 border-2"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
          <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
          <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col 
        items-center justify-center space-y-8 text-3xl transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100" : "opacity-0 invisible"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6 text-white text-4xl"
        >
          <div className="relative w-[48px] h-[48px]">
            <Image
              src="/close-button.png"
              alt="close button"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 1200px) 100vw"
            />
          </div>
        </button>
        <Link
          {...linkProps(home)}
          onClick={() => {
            handlePageChange(home);
            setMobileOpen(false);
          }}
          className={isSelectedItem(home)}
        >
          Home
        </Link>
        <Link
          {...linkProps(exercises)}
          onClick={() => {
            handlePageChange(exercises);
            setMobileOpen(false);
          }}
          className={isSelectedItem(exercises)}
        >
          Exercises
        </Link>
        {isLoggedIn && (
          <>
            <Link
              {...linkProps(myPrograms)}
              onClick={() => {
                handlePageChange(myPrograms);
                setMobileOpen(false);
              }}
              className={isSelectedItem(myPrograms)}
            >
              My Programs
            </Link>
            <Link
              {...linkProps(myStats)}
              onClick={() => {
                handlePageChange(myStats);
                setMobileOpen(false);
              }}
              className={isSelectedItem(myStats)}
            >
              My Stats
            </Link>
          </>
        )}
        <Link
          {...linkProps(communities)}
          onClick={() => {
            handlePageChange(communities);
            setMobileOpen(false);
          }}
          className={isSelectedItem(communities)}
        >
          Communities
        </Link>
      </div>
    </>
  );
};
