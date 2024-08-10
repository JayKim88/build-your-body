"use client";

import { SnackbarProvider } from "notistack";

import { RegisteredProgram } from "../api/types";
import { Exercises } from "../component/Exercises";

const ProgramsList = ({ data }: { data?: RegisteredProgram[] }) => {
  console.log("data in program list", data);

  return (
    <div className="flex flex-col gap-y-8">
      <SnackbarProvider>
        {/* <Exercises data={data} selectedType={selectedType} />   */}
      </SnackbarProvider>
    </div>
  );
};

export { ProgramsList };
