"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { MyStat } from "../api/types";

type HistoryChartProps = {
  programId: string;
};

export const HistoryChart = ({ programId }: HistoryChartProps) => {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [history, setHistory] = useState<MyStat[]>();

  const handleGetUpdatedPrograms = async () => {
    const fetchedData = (
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`, {
          params: {
            email: email,
            programId: programId,
          },
        })
        .then((res) => res.data)
    ).data as MyStat[] | undefined;

    setHistory(fetchedData);
  };

  useEffect(() => {
    if (!programId || !email) return;
    handleGetUpdatedPrograms();
  }, [programId, email]);

  const noHistory = !history?.length;

  return (
    <div className="w-[360px] h-[340px] flex flex-col gap-y-6 rounded-[32px] p-5 bg-gray0">
      <h1 className="text-2xl">
        {`History ${history?.[0]?.savedProgramName ?? ""}`}
        <div>{noHistory ? "운동을 먼저 진행해주세요!" : "그래프 보여주기"}</div>
      </h1>
    </div>
  );
};
