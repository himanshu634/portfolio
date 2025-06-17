import { Metadata } from "next";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center text-2xl justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="fade-in-text">
        Hii, from Himanshu 👋. <br />
      </div>
    </div>
  );
}

export function metadata(): Metadata {
  return {
    title: "Himanshu Mendapara",
  };
}
