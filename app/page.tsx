import Landing from "@/components/landing/Landing";

export default function Home() {
  const text = "BM ARTS";
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Landing text={text}/>
      </main>
    </div>
  );
}
