"use client";

import { useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RegisteredProgram } from "../api/types";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { OVERLAY_OPEN_DELAY } from "../component/ModalWrapper";
import { HistoryChart } from "./HistoryChart";
import { ProgramSummaryModal } from "../component/ProgramSummaryModal";

type HistoryByWeekSectionProps = {
  data: RegisteredProgram[];
};

type ProgramsProps = {
  data: RegisteredProgram[] | null;
  selectedProgramId: string;
  onSelectProgramId: (v: string) => void;
  onClickDetailProgramId: (v: string) => void;
  onSetIsOpen: (v: boolean) => void;
  loading: boolean;
};

const Programs = ({
  data,
  selectedProgramId,
  onSelectProgramId,
  onClickDetailProgramId,
  onSetIsOpen,
  loading,
}: ProgramsProps) => {
  const [programsInprogress, setProgramsInprogress] = useState(true);

  const memoizedData = useMemo(
    () =>
      data?.filter((v) => {
        return programsInprogress ? !v.deleted : v.deleted;
      }),
    [programsInprogress, data]
  );

  return (
    <div className="relative w-[360px] h-[340px] flex flex-col gap-y-5 rounded-[32px] p-5 bg-gray0">
      <div className={`${defaultRowStyles} items-center`}>
        <h1 className="text-2xl">Programs</h1>
        <div className="flex items-center text-[18px] gap-x-2">
          In progress
          <label className="switch-small width-[40px]">
            <input
              type="checkbox"
              onChange={(e) => setProgramsInprogress(e.target.checked)}
              checked={programsInprogress}
            />
            <span className="slider-small round"></span>
          </label>
        </div>
      </div>
      {!memoizedData?.length && (
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 text-2xl">
          No Data
        </div>
      )}
      <ul className="flex flex-col gap-y-4 overflow-auto">
        {memoizedData?.map((v) => {
          const isSelected = v._id === selectedProgramId;

          return (
            <li
              key={v._id}
              className={`m-1 h-10 rounded-3xl bg-gray1 flex justify-between px-4 py-2 cursor-pointer ${
                isSelected ? "outline outline-2 outline-yellow" : ""
              } ${loading ? "pointer-events-none" : ""}`}
              onClick={() => onSelectProgramId(v._id)}
            >
              <div>{v.programName}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClickDetailProgramId(v._id);
                  onSetIsOpen(true);
                }}
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  fontSize={24}
                  height={24}
                  className="hover:text-yellow"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const HistoryByWeekSection = ({ data }: HistoryByWeekSectionProps) => {
  const [selectedProgramId, setSelectedProgramId] = useState(
    data?.[0]?._id ?? ""
  );
  const [clickedDetailProgramId, setClickedDetailProgramId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoading = (v: boolean) => setLoading(v);

  const clickedProgramDetail = useMemo(
    () => data?.find((v) => v._id === clickedDetailProgramId),
    [clickedDetailProgramId, data]
  );
  const programName =
    data?.find((v) => v._id === selectedProgramId)?.programName ?? "";

  return (
    <section className="flex gap-x-5">
      <Programs
        data={data}
        selectedProgramId={selectedProgramId}
        onSetIsOpen={(v) => setIsOpen(v)}
        onClickDetailProgramId={(v) => setClickedDetailProgramId(v)}
        onSelectProgramId={(v) => {
          setLoading(true);
          setSelectedProgramId(v);
        }}
        loading={loading}
      />
      <HistoryChart
        programId={selectedProgramId}
        programName={programName}
        onSetLoading={handleLoading}
      />
      <ProgramSummaryModal
        isOpen={isOpen}
        data={clickedProgramDetail}
        onClose={() => {
          setIsOpen(false);
          setTimeout(() => {
            setClickedDetailProgramId("");
          }, OVERLAY_OPEN_DELAY);
        }}
      />
    </section>
  );
};

const defaultRowStyles = "flex gap-x-2 text-2xl justify-between";
