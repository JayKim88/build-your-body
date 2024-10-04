import LottiePlayer from "./component/LottiePlayer";

export default function Loading({ isComplete }: { isComplete?: boolean }) {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-20">
      <div className="w-full h-full flex items-center justify-center">
        <span
          className={`${
            isComplete ? "flex flex-col items-center" : "rounded-[150px]"
          } w-[300px] overflow-hidden`}
        >
          <LottiePlayer type={isComplete ? "complete" : "loading"} />
          {isComplete && (
            <span className="relative z-20 whitespace-pre-wrap text-center leading-8">
              {`운동 내용을 저장하고 있어요\n잠시만 기다려주세요 👍`}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
