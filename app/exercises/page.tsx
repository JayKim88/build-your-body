"use client";
import { useState } from "react";
import { Filters } from "../component/Filters";
import { SearchInput } from "../component/SearchInput";
import Link from "next/link";

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>();

  const handleSelectedFilter = (v: string) => {
    setSelectedFilter(v);
  };

  return (
    <div className="h-screen w-screen relative bg-black flex-col pt-[20px] px-[80px]">
      <section className="flex">
        <div className="flex gap-8">
          <Link href="/">
            <h1 className="text-[80px] text-stroke-4 text-stroke-black font-semibold">
              Build Your Body
            </h1>
          </Link>
          <SearchInput />
        </div>
      </section>
      <Filters onSelect={handleSelectedFilter} selected={selectedFilter} />
      <section>contents</section>
    </div>
  );
}
