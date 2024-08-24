"use client";

import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

export const CompletePageWrapper = ({ children }: { children: ReactNode }) => {
  return <SnackbarProvider>{children}</SnackbarProvider>;
};
