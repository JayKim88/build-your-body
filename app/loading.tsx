import LottiePlayer from "./component/LottiePlayer";

export default function Loading({ isComplete }: { isComplete?: boolean }) {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20">
      <div className="w-full h-full flex items-center justify-center">
        <span className="w-[300px] rounded-[150px] overflow-hidden">
          <LottiePlayer type={isComplete ? "complete" : "loading"} />
        </span>
      </div>
    </div>
  );
}
