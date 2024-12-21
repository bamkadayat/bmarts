import ArtsList from "@/components/arts/ArtsList";

export default function Artspage() {
  return (
    <div className="container mx-auto min-h-screen p-4 mt-[90px]">
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-gray-800">Arts Gallery</h1>
        <p className="text-lg text-gray-600">Explore our collection of beautiful arts</p>
      </header>
      <main className="mt-8">
        <ArtsList />
      </main>
    </div>
  );
}