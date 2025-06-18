"use client";
import { useState, useEffect } from "react";
import JackpotForm from "../app/jackpot-form";

export default function SideForm() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = ""; 
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-auto justify-center items-center inline-flex gap-1 text-white w-[130px] h-[35px] rounded-md text-[13px] bg-gradient-to-r from-red-500 to-orange-500"
      >
        <img src="/plus.svg" alt="plus" className="w-4 h-4" />
        Novo Bolão
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex overflow-y-auto overflow-x-hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-transformation duration-700 ease-in-out"
          />

          <div
            className="
            relative ml-auto h-full w-full max-w-md bg-[#101116] text-white shadow-xl overflow-y-auto p-6 custom-scrollbar
            transform transition-transform duration-500 ease-out"
            style={{
              transform: open ? "translateX(0%)" : "translateX(100%)",
            }}
          >
            <div className="flex justify-between items-center mb-8 border-b border-[#282B38] pb-5">
              <h2 className="text-x">Novo Bolão</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white"
              >
                ✕
              </button>
            </div>

            <JackpotForm onClose={() => setOpen(false)} />

          </div>
        </div>
      )}
    </>
  );
}
