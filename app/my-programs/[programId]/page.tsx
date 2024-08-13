import { getPrograms } from "@/app/api/programs/getData";
import { RegisteredProgram } from "@/app/api/types";
import { Header } from "@/app/component/Header";

export default async function Page({
  params,
}: {
  params: { programId: string };
}) {
  const fetchedData = (await getPrograms(params.programId)) as
    | RegisteredProgram
    | undefined;
  const { _id, userId, ...rest } = fetchedData ?? {};
  const formattedData = {
    ...rest,
    _id: _id?.toString(),
    userId: userId?.toString(),
  };

  return (
    <div className="h-fit w-screen relative bg-black flex flex-col pt-[20px] px-[80px] gap-y-8">
      <Header />
      <div>My Post: {params.programId}</div>
      <div>{formattedData._id}</div>
      <div>{formattedData.programName}</div>
    </div>
  );
}
