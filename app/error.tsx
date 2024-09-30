"use client";

import { useEffect } from "react";

import LottiePlayer from "./component/LottiePlayer";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <LottiePlayer type="error" />
    </div>
  );
}
