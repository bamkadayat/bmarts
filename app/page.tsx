import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-center flex-grow p-8 sm:p-20">
        <h1 className="text-4xl font-bold mb-8">Welcome to BM Arts</h1>
      </main>
      <Footer />
    </div>
  );
}
