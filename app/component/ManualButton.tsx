"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

const MANUAL_URL =
  "https://github.com/JayKim88/build-your-body?tab=readme-ov-file#overview-ui-and-manual";

export const ManualButton = () => (
  <span
    className="absolute top-[44px] right-10 transition-all flex flex-col 
    justify-center items-center ease-in-out duration-300 
    hover:text-yellow hover:cursor-pointer"
    onClick={() => window.open(MANUAL_URL, "_blank")}
  >
    <FontAwesomeIcon icon={faFileLines} fontSize={58} height={58} />
    <span className="text-[14px]">Manual</span>
  </span>
);
