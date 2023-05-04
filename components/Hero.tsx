import Link from "next/link";
import Container from "./layout/Container";

type Props = {
  heading: string;
  subHeading: string;
  link?: { title: string; to: string };
  alignment?: "left" | "right" | "center";
  showSeparator?: boolean;
  className?: string;
};

export default function Hero({
  className = "",
  heading,
  subHeading,
  link,
  alignment = "left",
  showSeparator = true,
}: Props) {
  return (
    <div
      className={`${
        showSeparator && "border-b border-dashed"
      } py-12 text-${alignment} ${className}`}
    >
      <Container>
        <h1 className="font-display text-3xl font-bold leading-[1.15] md:text-5xl ">
          <span className="bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800  bg-clip-text font-display text-4xl font-extrabold leading-tight text-transparent sm:text-5xl sm:leading-tight">
            {heading}
          </span>
        </h1>
        <p className="pt-2 text-2xl text-zinc-600">{subHeading}</p>
        {link && (
          <Link href={link.to}>
            <button className="mt-14 cursor-pointer rounded-md bg-black py-3 px-8 text-white hover:text-zinc-300">
              {link.title}
            </button>
          </Link>
        )}
      </Container>
    </div>
  );
}
