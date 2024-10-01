"use server";

import { getExercisesList } from "../api/exercises/getData";
import { FilteredList } from "./FilteredList";
import { Header } from "../component/Header";

export default async function Page() {
  const fetchedData = await getExercisesList();

  return (
    <div className="page-wrapper">
      <Header />
      <FilteredList data={fetchedData.data} />
    </div>
  );
}
