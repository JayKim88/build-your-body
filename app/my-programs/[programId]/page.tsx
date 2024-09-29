"use server";

import { getPrograms } from "@/app/api/programs/getData";
import { HistoryChartData, RegisteredProgram } from "@/app/api/types";
import { Header } from "@/app/component/Header";
import { Progress } from "./Progress";
import { getStats } from "@/app/api/my-stats/getData";

export default async function Page({
  params,
}: {
  params: { programId: string };
}) {
  const fetchedData = (await getPrograms({
    id: params.programId,
  })) as RegisteredProgram | undefined;
  const lastWorkoutData = (await getStats({
    programId: params.programId,
    lastWorkout: true,
  })) as HistoryChartData;

  return (
    <div className="page-wrapper">
      <Header />
      <Progress data={fetchedData} lastWorkoutData={lastWorkoutData} />
    </div>
  );
}
