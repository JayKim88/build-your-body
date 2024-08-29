import { getPrograms } from "../api/programs/getData";
import { RegisteredProgram } from "../api/types";
import { Header } from "../component/Header";
import { ProgramList } from "./ProgramList";

export default async function Page() {
  const fetchedData = (await getPrograms()) as RegisteredProgram[] | undefined;

  return (
    <div
      className="h-fit w-screen relative bg-black flex flex-col pt-[20px] 
    px-[80px] gap-y-8 max-w-[1800px]"
    >
      <Header />
      <ProgramList data={fetchedData} />
    </div>
  );
}
