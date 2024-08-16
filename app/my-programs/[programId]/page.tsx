import { getPrograms } from "@/app/api/programs/getData";
import { RegisteredProgram } from "@/app/api/types";
import { Header } from "@/app/component/Header";
import { Progress } from "./Progress";

export default async function Page({
  params,
}: {
  params: { programId: string };
}) {
  const fetchedData = (await getPrograms(params.programId)) as
    | RegisteredProgram
    | undefined;

  return (
    <div className="h-fit w-screen relative bg-black flex flex-col pt-[20px] px-[80px] gap-y-8">
      <Header />
      <Progress data={fetchedData} />
    </div>
  );
}
