import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchInput = () => {
  return (
    <div className="flex relative items-center w-[480px]">
      <input className="peer bg-gray2 border-gray6 border-2 focus:border-gray2 w-[480px] h-[64px] rounded-[32px] focus:outline-none focus:bg-gray6 focus:text-black text-4xl text-gray6 pl-16 pb-0.5" />
      <FontAwesomeIcon
        icon={faSearch}
        fontSize={36}
        height={36}
        className="absolute left-4 peer-focus:text-gray2"
      />
    </div>
  );
};
