"use client";
import React from "react";
import dynamic from "next/dynamic";

export type AnimationTypes =
  | "error"
  | "notFound"
  | "loading"
  | "cannotFind"
  | "complete"
  | "spinLoading";

type LazyLottiePlayerProps = {
  type: AnimationTypes;
  style?: React.CSSProperties | undefined;
};

// Lazy load Lottie library
const LazyLottie = dynamic(() => import("lottie-react"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded w-full h-full" />
  ),
  ssr: false,
});

// Lazy load animation data on-demand
const loadAnimation = async (type: AnimationTypes) => {
  switch (type) {
    case "error":
      return (await import("@/public/lottie-animation/error.json")).default;
    case "notFound":
      return (await import("@/public/lottie-animation/not-found.json")).default;
    case "loading":
      return (await import("@/public/lottie-animation/loading.json")).default;
    case "cannotFind":
      return (await import("@/public/lottie-animation/cannot-find.json"))
        .default;
    case "complete":
      return (await import("@/public/lottie-animation/complete.json")).default;
    case "spinLoading":
      return (await import("@/public/lottie-animation/spin-loading.json"))
        .default;
    default:
      return null;
  }
};

const LazyLottiePlayer = ({ type, style }: LazyLottiePlayerProps) => {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadAnimation(type).then((data) => {
      setAnimationData(data);
      setIsLoading(false);
    });
  }, [type]);

  if (isLoading || !animationData) {
    return (
      <div
        className="animate-pulse bg-gray-200 rounded w-full h-full"
        style={style}
      />
    );
  }

  return (
    <LazyLottie autoplay loop animationData={animationData} style={style} />
  );
};

export default LazyLottiePlayer;
