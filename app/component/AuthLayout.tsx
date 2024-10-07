"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/", { scroll: false });
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <>loading</>;
  }

  return <>{children}</>;
};

export { AuthLayout };
