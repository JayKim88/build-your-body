"use client";

import { useMemo } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { TotalWorkoutSummary } from "../api/types";
import { TotalWidget } from "../component/TotalWidget";
import { exerciseTypes } from "../component/Filter";
import { colors } from "@/tailwind.config";
import { capitalizeFirstLetter } from "../utils";

export type ColorKey = keyof typeof colors;
type TotalSummarySectionProps = {
  data: TotalWorkoutSummary | null;
};

Chart.register(ArcElement, Tooltip, Legend);

export const getRGBColor = (v: ColorKey) => colors[v];

export const TotalSummarySection = ({ data }: TotalSummarySectionProps) => {
  const memoizedTotalLift = useMemo(
    () => data?.liftByType.reduce((acc, cur) => acc + cur.lift, 0) ?? 0,
    [data]
  );

  const memoizedTotalWorkout = useMemo(() => data?.totalWorkout ?? 0, [data]);

  const sortedDescData = data?.liftByType.sort((a, b) => b.lift - a.lift) ?? [];

  const chartData = {
    labels: sortedDescData.map((v) => capitalizeFirstLetter(v.type)),
    datasets: [
      {
        data: sortedDescData.map((v) => v.lift),
        backgroundColor: sortedDescData.map((v) => {
          const foundBGColor = exerciseTypes.find(
            (exerciseType) => exerciseType.type == v.type
          )?.selectedBgColor;
          const color = foundBGColor?.replace("bg-", "") as ColorKey;
          const rgbColor = getRGBColor(color);

          return rgbColor;
        }),
        borderColor: [colors.transparent],
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        onClick: () => null,
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          generateLabels: (chart: Chart) => {
            const data = chart.data;

            const total = (chart.data.datasets[0].data as number[]).reduce(
              (acc, cur) => acc + cur,
              0
            );

            return data.labels!.map((label, i) => {
              const value = data.datasets[0].data[i] as number;
              const percentage = ((value / total) * 100).toFixed(2);

              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i, true);

              return {
                text: ` ${label}:   ${percentage}%`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                index: i,
                fontColor: colors.gray6,
              };
            });
          },
          font: {
            size: 16,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { label: string | null; parsed: number }) {
            return ` ${context.parsed.toLocaleString()} kg`;
          },
        },
        titleFont: {
          size: 22,
        },
        bodyFont: {
          size: 20,
        },
      },
    },
  };

  return (
    <section className="flex gap-x-5">
      <div className="flex flex-col gap-y-5">
        <TotalWidget title="Total Lift" data={memoizedTotalLift} unit="kg" />
        <TotalWidget
          title="Total Workout"
          data={memoizedTotalWorkout}
          unit="Times"
        />
      </div>
      <div className="w-[440px] h-[340px] flex flex-col gap-y-6 rounded-[32px] p-5 bg-gray0 relative">
        <h1 className="text-2xl">Total Portion Ratio</h1>
        <Doughnut
          data={chartData}
          options={options}
          style={{
            position: "absolute",
            bottom: 0,
          }}
        />
      </div>
    </section>
  );
};
