import { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`m-auto w-full max-w-5xl ${!!className && className}`}>
      {children}
    </div>
  );
}
