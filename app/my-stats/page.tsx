import { getStats } from "../api/my-stats/getData";
import { MyStat } from "../api/types";
import { Header } from "../component/Header";

export default async function Page() {
  const fetchedData = (await getStats()) as MyStat[] | undefined;

  /**
   * @todo make stats page with data!
   */
  console.log("fetchedData", fetchedData);

  return (
    <div
      className="h-fit w-screen relative bg-black flex flex-col pt-[20px] 
    px-[80px] gap-y-8 max-w-[1800px]"
    >
      <Header />
    </div>
  );
}
