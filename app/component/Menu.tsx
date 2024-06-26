import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Menu = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  return (
    <div className="flex flex-row-reverse bg-black font-white h-fit w-fit rounded-r-3xl absolute top-1/2 -translate-y-1/2">
      <div className="flex justify-start items-center peer w-[30px]">
        <Image
          src="/arrow-right.svg"
          width={18}
          height={30}
          alt="arrow right"
        />
      </div>
      <ul className="w-[0px] invisible peer-hover:visible peer-hover:w-[200px] pl-2 flex overflow-hidden flex-col justify-evenly text-2xl hover:visible hover:w-[200px] transition-all duration-500 ease-in-out [&>li]:w-[200px] [&>li]:h-[77.5px] [&>li]:flex [&>li]:items-center [&>li:hover]:text-yellow">
        <li
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
            <li>
              <Link href="/my-programs">My Programs</Link>
            </li>
            <li>
              <Link href="/my-stats">My Stats</Link>
            </li>
          </>
        )}
        <li>
          <Link href="/communities">Communities</Link>
        </li>
      </ul>
    </div>
  );
};

export { Menu };
