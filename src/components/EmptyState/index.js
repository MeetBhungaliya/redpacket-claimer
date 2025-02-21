"use client";

import { useRouter } from "next/navigation";

import Heading from "./Heading";

const EmptyState = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
  reset,
}) => {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4 flex flex-row gap-2">
        {showReset && <button onClick={() => reset && reset()} />}
        <button onClick={() => router.push("/")} />
      </div>
    </div>
  );
};

export default EmptyState;
