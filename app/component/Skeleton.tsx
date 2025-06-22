"use client";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-300 ${className}`} />
);

export default Skeleton;
