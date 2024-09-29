import { getPrograms } from "@/app/api/programs/getData";
import { RegisteredProgram } from "@/app/api/types";
import { Header } from "@/app/component/Header";
import { Progress } from "./Progress";

export default async function Page({
  params,
}: {
  params: { programId: string };
}) {
  const fetchedData = (await getPrograms({
    id: params.programId,
  })) as RegisteredProgram | undefined;

  return (
    <div className="page-wrapper">
      <Header />
      <Progress data={fetchedData} />
    </div>
  );
}
