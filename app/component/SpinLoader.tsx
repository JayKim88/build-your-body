import React from "react";
import LottiePlayer from "./LottiePlayer";

export const SpinLoader = () => (
  <div
    className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 z-20"
    data-testid="spin-loader"
  >
    <LottiePlayer
      type="spinLoading"
      style={{
        width: 40,
        height: 40,
      }}
    />
  </div>
);
