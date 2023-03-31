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
      <h1 className="font-display text-3xl font-bold leading-[1.15] md:text-5xl ">
        <span className="bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800  bg-clip-text font-display text-4xl font-extrabold leading-tight text-transparent sm:text-5xl sm:leading-tight">
          {heading}
        </span>
      </h1>
      <p className="pt-2 text-2xl text-zinc-500">{subHeading}</p>
      {link && (
        <Link href={link.to}>
          <button className="mt-10 cursor-pointer rounded-md bg-black py-3 px-8 text-white hover:text-zinc-300">
            {link.title}
          </button>
        </Link>
      )}
    </div>
  );
}
