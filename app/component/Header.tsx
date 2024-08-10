import Link from "next/link";
import { SearchInput } from "./SearchInput";

export const Header = () => {
  return (
    <div className="flex gap-8">
      <Link href="/">
        <h1 className="text-[80px] text-stroke-4 text-stroke-black font-semibold">
          Build Your Body
        </h1>
      </Link>
      {/* <SearchInput /> */}
    </div>
  );
};
