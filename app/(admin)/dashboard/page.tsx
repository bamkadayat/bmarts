"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { LuLayoutList } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchSummary } from "@/store/slices/summarySlice";
import SkeletonLoader from "@/components/SkeletonLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { totalProducts, totalOrders, totalUsers, loading } =
    useSelector((state: RootState) => state.summary);

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
    datasets: [
      {
        label: "Orders",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(255, 255, 255, 1)",
      },
    ],
  };

  const barOptions = {
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const doughnutData = {
    labels: ["Users", "Orders"],
    datasets: [
      {
        label: "Users",
        data: [80, 50],
        backgroundColor: ["rgba(255, 255, 255, 1)", "rgba(17, 24, 39, 1)"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
    datasets: [
      {
        label: "Orders",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "rgba(255, 255, 255, 1)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        pointBackgroundColor: "rgba(255, 255, 255, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="flex flex-col p-4">
      <main className="flex flex-1 container mx-0">
        <section className="flex-1 p-4">
          <h2 className="text-2xl font-semibold text-white mb-8">Overview</h2>

          {/* Skeleton Loader */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
                <div className="border border-slate-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <LuLayoutList size={16} color="white" />
                </div>
                <h3 className="text-lg font-medium text-white text-center">
                  Orders
                </h3>
                <p className="text-4xl font-bold text-white text-center">
                  {totalOrders}
                </p>
              </div>
              <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
                <div className="border border-slate-600  rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <FaUsers size={16} color="white" />
                </div>
                <h3 className="text-lg font-medium text-white text-center">
                  Users
                </h3>
                <p className="text-4xl font-bold text-white text-center">
                  {totalUsers}
                </p>
              </div>
              <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
                <div className="border border-slate-600  rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <AiFillProduct size={16} color="white" />
                </div>
                <h3 className="text-lg font-medium text-white text-center">
                  Arts
                </h3>
                <p className="text-4xl font-bold text-white text-center">
                  {totalProducts}
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
             
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="p-4 shadow-md border border-dashboardAccent rounded-xl">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          )}
        </section>
      </main>
    </div>
  );
}