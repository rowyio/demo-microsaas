import Spinner from "./Spinner";

export default function FullScreenLoader({ text }: { text: string }) {
  return (
    <div className="absolute top-0 left-0 h-full w-full bg-zinc-900/70">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h2 className="text-3xl  text-white">{text}</h2>
        <Spinner />
      </div>
    </div>
  );
}
