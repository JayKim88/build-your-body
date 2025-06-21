import Link from "next/link";

import { SearchInput } from "./SearchInput";
import { LoginButton } from "./LoginButton";
import { CartButton } from "./CartButton";

export const Header = () => {
  return (
    <div
      className="flex justify-end sm:justify-between items-center w-full 
      sm:w-[calc(100%-110px)] top-0 
    fixed bg-black z-20 h-[130px]"
    >
      <Link href="/" scroll={false} className="hidden sm:block">
        <h1
          className="text-[clamp(42px,6vw,80px)] text-stroke-4 
        text-stroke-black font-semibold min-w-fit"
        >
          Build Your Body
        </h1>
      </Link>
      <div className="flex gap-x-0 sm:gap-x-6 items-center pb-4">
        <CartButton />
        <LoginButton />
      </div>
    </div>
  );
};
