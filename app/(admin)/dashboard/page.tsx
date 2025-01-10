"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            label: "Orders",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "rgba(23, 36, 38, 1)",
        },
    ],
};

const pieData = {
    labels: ["Users", "Guests"],
    datasets: [
        {
            label: "Users",
            data: [300, 50],
            backgroundColor: ["rgba(208, 214, 179, 1)", "rgba(16, 25, 26, 1)"],
        },
    ],
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen p-4 ">
            <main className="flex flex-1">
                <section className="flex-1 bg-white shadow p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className=" p-4 ">
                            <h3 className="text-lg font-medium text-gray-700">Orders</h3>
                            <Bar data={barData} />
                        </div>
                        <div className="bg-green-100 p-4 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Users</h3>
                            <Pie data={pieData} />
                        </div>
                        <div className="bg-red-100 p-4 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Arts</h3>
                            <p className="text-2xl font-bold text-gray-900">789</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
