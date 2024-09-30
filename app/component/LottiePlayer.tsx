"use client";
import React from "react";
import Lottie from "lottie-react";

import errorLottie from "@/public/lottie-animation/error.json";
import notFoundLottie from "@/public/lottie-animation/not-found.json";
import loadingLottie from "@/public/lottie-animation/loading.json";

const animations = {
  error: errorLottie,
  notFound: notFoundLottie,
  loading: loadingLottie,
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
