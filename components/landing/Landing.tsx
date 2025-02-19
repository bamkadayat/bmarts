"use client";
import * as React from "react";
import Link from "next/link";
import RecentArts from "./RecentArts";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Landing() {
  return (
    <div>
      <section className="bg-hero-pattern bg-cover bg-[#081113] bg-center py-20 min-h-[600px] flex items-center">
        <div className="container flex-col-reverse mx-auto flex lg:flex-row justify-between items-center px-4">
          <div className="text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-100 mb-8 md:mb-12 leading-tight tracking-wide drop-shadow-lg max-w-[800px]">
              Explore the perfect blend of{" "}
              <strong className="text-accent">creativity</strong>, innovation,
              and <strong className="text-accent">passion</strong>.
            </h1>
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
          <div className="flex lg:flex-row  justify-center lg:justify-end">
            <div className="w-28 lg:w-96 mb-5">
              <Image
                src="/assets/hero.jpg"
                alt="hero"
                width={400}
                height={400}
                className="w-full h-auto "
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto p-4 my-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Recently arts</h2>
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
