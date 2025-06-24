"use client";
import { useState, useEffect } from "react";
import SuperOddForm from "../app/superOdd-form";
import { SuperOdds } from "@/app/features/superOdd/types";

export default function SideForm() {

  const [open, setOpen] = useState(false);
  const [editingSuperOdd, setEditingSuperOdd] = useState<SuperOdds | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        className="ml-auto inline-flex justify-center items-center justify-center items-center inline-flex gap-1 text-white w-[130px] h-[35px] rounded-md text-[13px] bg-gradient-to-r from-red-500 to-orange-500 "
      >
        <img src="/plus.svg" alt="plus" className="w-5 h-5 relative overflow-hidden" />
        Nova SuperOdd
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex overflow-y-auto overflow-x-hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-transformation duration-700 ease-in-out"
          />

          <div
            className="
            relative ml-auto h-full w-full max-w-md bg-[#101116] text-white shadow-xl overflow-y-auto p-4 !scrollbar-rounded-[5px] custom-scrollbar-bg-[#858FAB]
            transform transition-transform duration-500 ease-out"
            style={{
              transform: open ? "translateX(0%)" : "translateX(100%)",
            }}
          >
            <div className="flex justify-between items-center mb-8 border-b border-[#282B38] pb-5">
              <h2 className="">Nova SuperOdd</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-center"
              >
                ✕
              </button>
            </div>

            <SuperOddForm onClose={() => setOpen(false)}  superOddToEdit={editingSuperOdd}/>

          </div>
        </div>
      )}
    </>
  );
}
