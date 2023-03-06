import { useEffect } from "react";
import Spinner from "./Spinner";

export default function FullScreenLoader({
  text,
  isOpen,
}: {
  text: string;
  isOpen: boolean;
}) {
  useEffect(() => {
    const body = document.querySelector("body");

    if (isOpen) {
      body?.classList.add("fullscreen-active");
    } else {
      body?.classList.remove("fullscreen-active");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 h-screen  w-full bg-white/95">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h2 className="text-2xl text-zinc-700  md:text-3xl">{text}</h2>
        <Spinner />
      </div>
    </div>
  );
}
