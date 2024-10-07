import Link from "next/link";

import { SearchInput } from "./SearchInput";
import { LoginButton } from "./LoginButton";
import { CartButton } from "./CartButton";

export const Header = () => {
  return (
    <div
      className="flex justify-between items-end w-[calc(100%-110px)] top-0 
    fixed bg-black z-20 h-[130px]"
    >
      <Link href="/" scroll={false}>
        <h1 className="text-[80px] text-stroke-4 text-stroke-black font-semibold">
          Build Your Body
        </h1>
      </Link>
      <div className="flex gap-x-6 items-center pb-4">
        <CartButton />
        <LoginButton />
      </div>
    </div>
  );
};
