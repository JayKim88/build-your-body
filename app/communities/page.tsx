"use server";

import { Header } from "../component/Header";
import { getCommunitiesList } from "../api/communities/getData";
import { MyStat as PerformedData } from "../api/types";
import { FilteredList } from "./FilteredList";
import { getUserId } from "../api/user/getData";

export default async function Page() {
  const fetchedData = (await getCommunitiesList()) as PerformedData[];
  const userId = (await getUserId())?.toString();

  return (
    <div
      className="h-fit w-screen relative bg-black flex-col pt-[20px] 
    px-[80px] max-w-[1800px]"
    >
      <Header />
      <FilteredList data={fetchedData} userId={userId} />
    </div>
  );
}