import { Filters } from "../component/Filters";
import { SearchInput } from "../component/SearchInput";
import Link from "next/link";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
}

export default async function Page() {
  const exercisesData = (await getData()) as { exercises: string[] };

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
      <Filters />
      {exercisesData.exercises.map((v) => (
        <div key={v}>{v}</div>
      ))}
    </div>
  );
}
