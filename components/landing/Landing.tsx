import Link from "next/link";
export default function Landing() {
  return (
    <section
      className="relative text-white"
      style={{ height: "70vh", width: "100vw" }}
    >
      {/* Background Image */}
      <div
        className="absolute top-0 inset-0 bg-cover bg-center"
        style={{
          background: "url('hero.jpg')",
          height: "100%",
          width: "100%",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Hero Content */}
      <div className="relative top-6 md:top-6 h-full flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Welcome to <span className="text-accent font-bold uppercase">BM Arts</span>
        </h1>
        <p className="text-lg md:text-2xl md:max-w-[580px] text-gray-300 mb-8">
          Where Imagination Comes to Life Explore the perfect blend of
          creativity, innovation, and passion.
        </p>
        <div className="flex gap-4">
          <Link
            href="/arts"
            className="bg-accent hover:bg-gray-600 text-primary hover:text-white py-3 px-6 rounded-md text-lg font-medium transition duration-300 cursor-pointer"
          >
            Buy Now
          </Link>
          <Link
            href="/"
            className="bg-transparent border border-gray-300 hover:bg-gray-300 hover:text-gray-900 text-white py-3 px-6 rounded-md text-lg font-medium transition duration-300 cursor-pointer"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
