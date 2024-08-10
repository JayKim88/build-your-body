import Link from "next/link";

import { getPrograms } from "../api/programs/getData";
import { Header } from "../component/Header";
import { ProgramsList } from "./ProgramsList";

export default async function Page() {
  const fetchedData = await getPrograms();

  return (
    <div className="h-fit w-screen relative bg-black flex-col pt-[20px] px-[80px]">
      <Header />
      <ProgramsList data={fetchedData} />
    </div>
  );
}
