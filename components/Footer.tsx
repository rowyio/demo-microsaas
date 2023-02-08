export default function Footer() {
  return (
    <div className="mt-4 border-t py-8 text-center">
      <p className="text-zinc-800">
        Powered by{" "}
        <a
          href="https://rowy.io/"
          target="_blank"
          rel="noreferrer"
          className="font-bold underline-offset-2 transition hover:underline"
        >
          Rowy
        </a>{" "}
        and Vercel
      </p>
    </div>
  );
}
