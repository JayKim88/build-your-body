import React from "react";
import { useSnackbar as useNotistack, OptionsObject } from "notistack";

const useBodySnackbar = () => {
  const { enqueueSnackbar } = useNotistack() ?? {};

  const bodySnackbar = (
    message: string,
    options?: OptionsObject | undefined
  ) => {
    enqueueSnackbar(message, {
      variant: options?.variant,
      autoHideDuration: 2000,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
    });
  };

  return { bodySnackbar };
};

export { useBodySnackbar };
