import { getPrograms } from "../api/programs/getData";
import { RegisteredProgram } from "../api/types";
import { Header } from "../component/Header";
import { ProgramList } from "./ProgramList";

export default async function Page() {
  const fetchedData = (await getPrograms()) as RegisteredProgram[] | undefined;

  return (
    <div className="page-wrapper">
      <Header />
      <ProgramList data={fetchedData} />
    </div>
  );
}
