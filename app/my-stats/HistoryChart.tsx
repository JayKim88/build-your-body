"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CategoryScale,
  Chart,
  Color,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { HistoryChartData } from "../api/types";
import { format } from "date-fns";
import { exerciseTypes } from "../component/Filter";
import { ColorKey, getRGBColor } from "./TotalSummarySection";
import { colors } from "@/tailwind.config";

Chart.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

type HistoryChartProps = {
  programId: string;
  programName: string;
};

export const HistoryChart = ({ programId, programName }: HistoryChartProps) => {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [history, setHistory] = useState<HistoryChartData>();

  const getWorkoutHistory = useCallback(async () => {
    const fetchedData = (
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
          params: {
            email: email,
            programId: programId,
          },
        })
        .then((res) => res.data)
    ).data as HistoryChartData | undefined;

    setHistory(fetchedData);
  }, [email, programId]);

  useEffect(() => {
    if (!programId || !email) return;
    getWorkoutHistory();
  }, [programId, email, getWorkoutHistory]);

  const labels = history?.[0]?.items
    .map((v) => format(v.date, "MM/dd"))
    .reverse();
  const datasets =
    useMemo(
      () =>
        history?.map((v, index) => {
          const label = v.name;
          const data = v.items.map((item) => item.lift).reverse();
          const colors = exerciseTypes.map((v) =>
            getRGBColor(v.selectedBgColor?.replace("bg-", "") as ColorKey)
          );

          return {
            label,
            data,
            borderColor: colors[index],
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors[index],
          };
        }),
      [history]
    ) ?? [];

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "transparent",
        },
        ticks: {
          color: colors.gray6,
        },
        border: {
          color: colors.gray6,
          width: 1,
        },
      },
      y: {
        grid: {
          color: "transparent",
        },
        ticks: {
          color: colors.gray6,
        },
        border: {
          color: colors.gray6,
          width: 1,
        },
      },
    },
    plugins: {
      legend: {
        onClick: () => null,
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          generateLabels: (chart: Chart<"line">) => {
            const datasets = chart.data.datasets;

            return datasets.map((data, i) => ({
              text: ` ${data.label}`,
              fillStyle: data.borderColor as Color,
              strokeStyle: data.borderColor as Color,
              index: i,
              fontColor: colors.gray6,
            }));
          },
          font: {
            size: 14,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            const value = context.raw as number;

            return ` ${value.toLocaleString()} kg`;
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

  const noHistory = !history?.length;

  return (
    <div className="w-[440px] h-[340px] flex flex-col gap-y-6 rounded-[32px] p-5 bg-gray0">
      <h1 className="text-2xl">
        {`History ${programName}`}
        {noHistory ? (
          "운동을 먼저 진행해주세요!"
        ) : (
          <Line
            data={data}
            options={options}
            style={{
              marginTop: 40,
            }}
          />
        )}
      </h1>
    </div>
  );
};
