import React from "react";
import { Header } from "../component/Header";
import { getCommunitiesList } from "../api/communities/getData";
import { MyStat as PerformedData } from "../api/types";
import { FilteredList } from "./FilteredList";
import { getUserId } from "../api/user/getData";

export default async function Page() {
  const [fetchedData, userId] = await Promise.all([
    getCommunitiesList(),
    getUserId(),
  ]);

  return (
    <div className="page-wrapper">
      <Header />
      <FilteredList
        data={fetchedData as PerformedData[]}
        userId={userId?.toString()}
      />
    </div>
  );
}
