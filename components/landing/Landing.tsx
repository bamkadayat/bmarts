"use client";
import * as React from "react";
import Link from "next/link";
import RecentArts from "./RecentArts";
import { FaArrowRightLong } from "react-icons/fa6";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";

export default function Landing({ text }: { text: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div>
      <section className="bg-hero-pattern bg-cover bg-[#081113] bg-center py-20">
        <div className="container mx-auto px-4 mt-10">
          <div className="flex lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-10 lg:mb-0">
              <div className="flex justify-center lg:justify-start items-center mb-6">
                <h1 className="whitespace-nowrap text-2xl md:text-5xl font-bold text-white drop-shadow-lg font-sans mr-2">
                  Welcome to{" "}
                </h1>
                <div className="flex space-x-1 justify-start">
                  <AnimatePresence>
                    {text.split("").map((char, i) => (
                      <motion.span
                        ref={ref}
                        key={i}
                        initial={{
                          opacity: 0,
                          x: -18,
                          scale: 0.8,
                          rotate: -10,
                        }}
                        animate={
                          isInView
                            ? { opacity: 1, x: 0, scale: 1, rotate: 0 }
                            : {}
                        }
                        exit={{ opacity: 0, x: 18, scale: 0.8, rotate: 10 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                        className="text-2xl font-bold tracking-tighter md:text-5xl text-accent"
                      >
                        {char === " " ? <span>&nbsp;</span> : char}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <p className="text-lg md:text-2xl max-w-2xl text-gray-300 mb-10 leading-relaxed tracking-wide font-sans">
                Explore the perfect blend of creativity, innovation, and
                passion.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/arts"
                  className="bg-accent hover:bg-gray-600 text-primary hover:text-white py-3 px-6 rounded-md md:text-lg text-sm font-medium transition duration-300 cursor-pointer"
                >
                  Buy Now
                </Link>
                <Link
                  href="/"
                  className="bg-transparent border border-gray-300 hover:bg-gray-300 hover:text-gray-900 text-white py-3 px-6 rounded-md font-medium transition duration-300 cursor-pointer md:text-lg text-sm"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/assets/hero.jpg"
                alt="hero"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
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
