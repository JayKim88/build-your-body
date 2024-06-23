import Image from "next/image";
import Link from "next/link";

const Menu = () => {
  return (
    <div className="flex flex-row-reverse bg-black font-white h-[310px] w-fit rounded-r-3xl">
      <div className="flex justify-center items-center peer w-[30px]">
        <Image
          src="/arrow-right.svg"
          width={18}
          height={30}
          alt="arrow right"
        />
      </div>
      <ul className="w-[0px] invisible peer-hover:visible peer-hover:w-[250px] flex overflow-hidden flex-col justify-evenly text-2xl hover:visible hover:w-[250px] transition-all duration-500 ease-in-out [&>li]:w-[250px]">
        <li>
          <Link href="/exercises">Exercises</Link>
        </li>
        <li>
          <Link href="/my-programs">My Programs</Link>
        </li>
        <li>
          <Link href="/my-stats">My Stats</Link>
        </li>
        <li>
          <Link href="/communities">Communities</Link>
        </li>
      </ul>
    </div>
  );
};

export { Menu };
