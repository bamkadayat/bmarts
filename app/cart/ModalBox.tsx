"use client";
import React from "react";
import { RxCross2 } from "react-icons/rx";

export default function ModalBox({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black bg-opacity-60 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl z-10 min-h-[100px] min-w-[400px] flex justify-between items-center">
        <div><p className="text-gray-800 text-lg font-medium">{message}</p></div>
        <div><button onClick={onClose}>
          <RxCross2 color="primary" size={25} />
        </button></div>
      </div>
    </div>
  );
}
