"use server";

import Link from "next/link";

import { SearchInput } from "../component/SearchInput";
import { getExercisesList } from "../api/exercises/getData";
import { FilteredList } from "./FilteredList";

export default async function Page() {
  const fetchedData = await getExercisesList();

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
      <FilteredList data={fetchedData.data} />
    </div>
  );
}
