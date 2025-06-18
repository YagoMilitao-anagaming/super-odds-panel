'use client';
import { useEffect, useState } from "react";
import EditForm from "../app/edit-form";

export default function SideFormEdit() {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const [open, setOpen] = useState(false);

    return (
        <>
        {open && (
            <div className="fixed inset-0 z-50 flex overflow-y-auto overflow-x-hidden">
                <div
                    onClick={() => setOpen(false)}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-transform duration-700 ease-in-out"
                />

                <div
                    className="
                relative ml-auto h-full w-full max-w-md bg-[#101116] text-white shadow-xl overflow-y-auto p-6 custom-scrollbar
                transform transition-transform duration-500 ease-out"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8 border-b border-[#282B38] pb-5">
                        <h2 className="text-lg">RESULTADOS</h2>

                        <button onClick={() => setOpen(false)} className="text-white text-xl">
                            ✕
                        </button>
                    </div>

                    <EditForm />
                </div>
            </div>
        )};
        </>
    );
}
