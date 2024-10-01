import { LoginButton } from "./component/LoginButton";

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
      >
        <source
          src={`${process.env.VIDEO_BUCKET_URL}/dwayne-johnson-training.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <h1
        className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2       
        -translate-y-[100px] text-stroke-4 text-stroke-black font-semibold
        text-fluid whitespace-nowrap"
      >
        Build Your Body
      </h1>
      <LoginButton />
    </div>
  );
}
