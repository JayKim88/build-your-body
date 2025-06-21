"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

import { RegisteredProgram, TotalWorkoutSummary } from "../api/types";
import { HistoryByDateSection } from "./HistoryByDateSection";
import { HistoryByWeekSection } from "./HistoryByWeekSection";
import { TotalSummarySection } from "./TotalSummarySection";
import { useIsMobile } from "../hook/useWindowSize";

type StatSectionsProps = {
  totalSummary: TotalWorkoutSummary;
  programs: RegisteredProgram[];
};

export const StatSections = ({ totalSummary, programs }: StatSectionsProps) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [moveBtn, setMoveBtn] = useState(false);
  const [leftBtnHovered, setLeftBtnHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMoveBtn = () => {
    if (!ref.current) return;

    const scrollWidth = ref.current.scrollWidth;
    const clientWidth = ref.current.clientWidth;
    const hasScroll = scrollWidth > clientWidth;

    setMoveBtn(hasScroll);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", handleMoveBtn);
    handleMoveBtn();

    return () => window.removeEventListener("resize", handleMoveBtn);
  }, []);

  return (
    <main
      ref={ref}
      className={`flex gap-x-5 gap-y-5 overflow-auto sm:max-w-[calc(100vw-110px)]
        lg:flex-row flex-col mb-[100px] sm:mb-0
    transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <section className="flex flex-col gap-y-5">
        <TotalSummarySection data={totalSummary} />
        <HistoryByWeekSection data={programs} />
      </section>
      <HistoryByDateSection />
      {!isMobile && moveBtn && (
        <div
          className="flex flex-col items-center justify-center fixed right-2 
        top-1/2 -translate-y-1/2"
        >
          <FontAwesomeIcon
            icon={faAnglesLeft}
            fontSize={36}
            className="hover:cursor-pointer hover:text-yellow"
            onMouseOver={() => {
              if (!ref.current) return;
              ref.current.scrollTo({
                left: 0,
                behavior: "smooth",
              });
            }}
          />
          <FontAwesomeIcon
            icon={faAnglesRight}
            fontSize={36}
            className={`${
              leftBtnHovered
                ? "hover:text-yellow"
                : "text-yellow animate-heartBeat"
            } hover:cursor-pointer`}
            onMouseOver={() => {
              if (!ref.current) return;
              ref.current.scrollTo({
                left: ref.current.scrollWidth,
                behavior: "smooth",
              });
              setLeftBtnHovered(true);
            }}
          />
        </div>
      )}
    </main>
  );
};
