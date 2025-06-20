"use client";
import React from "react";
import Lottie from "lottie-react";

import errorLottie from "@/public/lottie-animation/error.json";
import pageNotFoundLottie from "@/public/lottie-animation/not-found.json";
import loadingLottie from "@/public/lottie-animation/loading.json";
import cannotFindDataLottie from "@/public/lottie-animation/cannot-find.json";
import completeLottie from "@/public/lottie-animation/complete.json";
import spinLoadingLottie from "@/public/lottie-animation/spin-loading.json";

export const animations = {
  error: errorLottie,
  notFound: pageNotFoundLottie,
  loading: loadingLottie,
  cannotFind: cannotFindDataLottie,
  complete: completeLottie,
  spinLoading: spinLoadingLottie,
};

export type AnimationTypes = keyof typeof animations;

type LottiePlayerProps = {
  type: AnimationTypes;
  style?: React.CSSProperties | undefined;
};

const LottiePlayer = ({ type, style }: LottiePlayerProps) => {
  const animation = animations[type];

  return <Lottie autoplay loop animationData={animation} style={style} />;
};

export default LottiePlayer;
