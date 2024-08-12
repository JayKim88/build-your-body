import { getPrograms } from "../api/programs/getData";
import { Header } from "../component/Header";
import { ProgramList } from "./ProgramList";

export default async function Page() {
  const fetchedData = await getPrograms();
  const formattedData = fetchedData?.map(({ _id, userId, ...rest }) => ({
    ...rest,
    _id: _id.toString(),
    userId: userId.toString(),
  }));

  return (
    <div className="h-fit w-screen relative bg-black flex flex-col pt-[20px] px-[80px] gap-y-8">
      <Header />
      <ProgramList data={formattedData} />
    </div>
  );
}
