"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeaderLogo() {
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      router.push("/");
    }
  };

  return (
    <div
      className="text-2xl font-bold cursor-pointer"
      onClick={() => router.push("/")}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <Image src={"bm-logo.svg"} width={100} height={40} priority alt="bm logo" />
    </div>
  );
}