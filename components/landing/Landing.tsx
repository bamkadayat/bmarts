"use client";
import * as React from "react";
import Link from "next/link";
import RecentArts from "./RecentArts";
import { FaArrowRightLong } from "react-icons/fa6";
import { AnimatePresence, motion, useInView } from "framer-motion";

export default function Landing({ text }: { text: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div>
      <section
        className="relative text-white"
        style={{ height: "70vh", width: "100vw" }}
      >
        {/* Background Image */}
        <div
          className="absolute top-0 inset-0 bg-cover bg-center"
          style={{
            backgroundColor: "#10191A",
            height: "100%",
            width: "100%",
          }}
        ></div>

        {/* Hero Content */}
        <div className="relative top-6 md:top-6 h-full flex flex-col justify-center items-center text-center px-6">
          <div className="flex justify-center items-center">
            <h1 className="mr-2 whitespace-nowrap text-3xl md:text-4xl font-bold text-center leading-tight text-white drop-shadow-lg font-sans mb-4">Welcome to </h1>

            <div className="flex space-x-1 justify-center mb-4">
              <AnimatePresence>
                {text.split("").map((char, i) => (
                  <motion.span
                    ref={ref}
                    key={i}
                    initial={{ opacity: 0, x: -18, scale: 0.8, rotate: -10 }}
                    animate={
                      isInView ? { opacity: 1, x: 0, scale: 1, rotate: 0 } : {}
                    }
                    exit={{ opacity: 0, x: 18, scale: 0.8, rotate: 10 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="text-3xl font-bold tracking-tighter md:text-4xl md:leading-[1rem] text-accent "
                  >
                    {char === " " ? <span>&nbsp;</span> : char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <p className="text-lg md:text-2xl md:max-w-[580px] text-gray-300 mb-8 text-center leading-relaxed tracking-wide font-sans">
            Where Imagination Comes to Life. Explore the perfect blend of
            creativity, innovation, and passion.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-4"
          >
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
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto p-4 my-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Recent arts</h2>
          </div>
          <div>
            <Link
              href={"/arts"}
              className="flex justify-between items-center font-bold text-lg "
            >
              All arts{" "}
              <FaArrowRightLong size={20} color="black" className="ml-2" />
            </Link>
          </div>
        </div>
        <RecentArts />
      </section>
    </div>
  );
}
