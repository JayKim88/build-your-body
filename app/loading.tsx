import LottiePlayer from "./component/LottiePlayer";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="w-[300px] rounded-[150px] overflow-hidden">
        <LottiePlayer type="loading" />
      </span>
    </div>
  );
}
