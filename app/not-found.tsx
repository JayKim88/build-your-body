import Link from "next/link";

import LottiePlayer from "./component/LottiePlayer";

export default function NotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LottiePlayer type="notFound" />
      <Link href="/">Return Home</Link>
    </div>
  );
}
