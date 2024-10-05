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
import {
  startOfDay,
  subDays,
  format,
  eachDayOfInterval,
  addDays,
  isSameDay,
} from "date-fns";

import { HistoryChartData } from "../api/types";
import { exerciseTypes } from "../component/Filter";
import { ColorKey, getRGBColor } from "./TotalSummarySection";
import { colors } from "@/tailwind.config";
import CircleArrow from "@/public/circle-arrow.svg";
import { SpinLoader } from "../component/SpinLoader";

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

function getRecent7Days(target: Date) {
  const end = startOfDay(target);
  const start = subDays(end, 6);
  const daysArray = eachDayOfInterval({ start, end });

  return daysArray.map((date) => format(date, "yyyy-MM-dd"));
}

export const HistoryChart = ({ programId, programName }: HistoryChartProps) => {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [history, setHistory] = useState<HistoryChartData>();
  const [endDate, setEndDate] = useState(new Date());
  const [labels, setLabels] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(false);

  const getWorkoutHistory = useCallback(async () => {
    const labels = getRecent7Days(endDate);
    const timeZoneDifference = -new Date().getTimezoneOffset() / 60;

    const fetchedData = (
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
          params: {
            email: email,
            programId: programId,
            endDate: endDate,
            timeZoneDifference,
          },
        })
        .then((res) => res.data)
    ).data as HistoryChartData | undefined;

    const formatted7DaysHistory = fetchedData?.map((v) => {
      const items = labels
        ?.map((label) => {
          const foundItem = v.items.find((item) => item.date === label);
          return {
            date: label,
            lift: foundItem ? foundItem.lift : 0, // fill 0 in case no data
          };
        })
        .reverse();

      return {
        name: v.name,
        type: v.type,
        items,
      };
    });

    setLabels(labels);
    setHistory(formatted7DaysHistory);
    setLoading(false);
  }, [email, programId, endDate]);

  useEffect(() => {
    if (!programId || !email) return;

    setLoading(true);
    getWorkoutHistory();
  }, [programId, email, endDate, getWorkoutHistory]);

  useEffect(() => {
    setEndDate(new Date());
  }, [programId]);

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
          boxHeight: 10,
          padding: 12,
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
    <div className="w-[540px] h-[340px] flex flex-col gap-y-6 rounded-[32px] p-5 bg-gray0">
      <h1 className="text-2xl">{`History by Week - ${programName}`}</h1>
      <div className="flex justify-center items-center h-full">
        <div className="flex justify-center items-center h-full relative w-[460px] max-w-[460px]">
          {loading && <SpinLoader />}
          {noHistory && (
            <div className="absolute top-1/2 right-1/2 -translate-y-[38px] translate-x-1/2 text-2">
              No Data
            </div>
          )}
          <CircleArrow
            width={32}
            height={32}
            alt="left button"
            className={`${arrowStyles} rotate-180 -left-6 -translate-y-[40px]`}
            onClick={() => {
              setEndDate((prev) => subDays(prev, 1));
            }}
          />
          <Line
            data={data}
            options={options}
            style={{
              marginRight: 10,
            }}
          />
          <CircleArrow
            width={32}
            height={32}
            alt="left button"
            className={`${arrowStyles} -right-6 -translate-y-[44px]`}
            onClick={() => {
              if (isSameDay(endDate, new Date())) return;
              setEndDate((prev) => addDays(prev, 1));
            }}
          />
        </div>
      </div>
    </div>
  );
};

const arrowStyles =
  "absolute stroke-gray6 hover:stroke-yellow cursor-pointer top-1/2";
