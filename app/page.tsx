import React from "react";
import { LoginButton } from "./component/LoginButton";
import { ManualButton } from "./component/ManualButton";

export default function Page() {
  return (
    <div className="h-full w-full">
      <video
        className="absolute top-1/2 left-1/2 w-full h-full object-cover 
        -translate-x-1/2 -translate-y-1/2"
        autoPlay
        muted
        loop
        playsInline
        poster="/landing.webp"
      >
        <source
          src={`${process.env.VIDEO_BUCKET_URL}/dwayne-johnson-training.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <h1
        className="z-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
        text-white text-7xl sm:text-8xl font-semibold text-center drop-shadow-lg text-stroke-4 text-stroke-black"
      >
        Build Your Body
      </h1>
      <ManualButton />
      <LoginButton />
    </div>
  );
}
