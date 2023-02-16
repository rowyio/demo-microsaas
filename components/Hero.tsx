import Link from "next/link";

type Props = {
  heading: string;
  subHeading: string;
  link?: { title: string; to: string };
  alignment?: "left" | "right" | "center";
};

export default function Hero({
  heading,
  subHeading,
  link,
  alignment = "left",
}: Props) {
  return (
    <div className={`border-b-2 border-zinc-200 pb-12 text-${alignment}`}>
      <h1 className="text-3xl md:text-5xl">{heading}</h1>
      <p className="pt-2 text-xl text-zinc-500">{subHeading}</p>
      {link && (
        <Link href={link.to}>
          <button className="mt-10 cursor-pointer rounded-md bg-black py-2 px-8 text-white hover:text-zinc-300">
            {link.title}
          </button>
        </Link>
      )}
    </div>
  );
}
