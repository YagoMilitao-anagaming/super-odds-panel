import React from "react";
import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { deleteJackpot, fetchAllJackpots } from "@/app/features/jackpot/jackpotSlice";
import ConfirmModal from "./ConfirmModal";
import SideFormEdit from "./SideFormEdit";

interface MatchCardProps {
    title: string;
    status: string;
    value: string;
    house: string;
    date: string;
    id: string;
    description: string;
};

export default function MatchCard({
    title,
    status,
    value,
    house,
    date,
    id,
    description

}: MatchCardProps) {

    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isMetricEnabled = status.toLowerCase() === "finished";
    const isDisabledMetric = !isMetricEnabled
    const isEditable = status.toLowerCase() === "active" || status.toLowerCase() === "processing";
    const isActive = status.toLowerCase() === "active";
    const isProcessing = status.toLowerCase() === "processing";



    const handleDelete = async () => {
        try {
            await dispatch(deleteJackpot(id)).unwrap();
            await dispatch(fetchAllJackpots());
        } catch (error) {
            console.error('Erro ao deletar jackpot:', error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const houseColor = {
        cassino: "bg-[#146AFF]",
        "7k": "bg-[#05764A]",
    }[house.toLowerCase()] || "bg-gray-500";


    const statusGame =
        status.toLowerCase() === "active"
            ? "/status-active.svg"
            : status.toLowerCase() === "processing"
                ? "/status-processing.svg"
                : status.toLowerCase() === "pending"
                    ? "/status-processing.svg"
                    : status.toLowerCase() === "finished"
                        ? "/status-finished.svg"
                        : ""
        ;

    return (

        <div className="flex mt-8 w-[850px] bg-[#15161D] mx-auto px-4 py-3 rounded relative">
            <img
                src="/picture-box.svg"
                alt="picture-box"
                className="w-[100px] h-[100px] self-start"
            />

            <div className="flex flex-col ml-4 mt-3 flex-1">
                <div className="flex items-center gap-1">
                    <h1 className="text-[13px] text-[#B0B6C9]">
                        {title}
                    </h1>
                    <img src={statusGame} alt="status" className="w-[100px] h-[15px]" />
                </div>

                {/* <div className="flex items-center gap-2 mt-1">
                    <button className="inline-flex items-center gap-1 text-[11px] text-[#B0B6C9] rounded-md bg-[rgba(185,222,255,0.16)] px-2 py-0">
                        <img src="/link.svg" alt="link" className="w-3 h-3" />
                        {link}
                    </button>

                    <button className="w-20 h-7 gap-1 text-[11px] text-[#858FAB] rounded-md bg-[#15161D] border border-[#282B38]">
                        Copiar link
                    </button>
                </div> */}

                <div className="flex items-center justify-between mt-7">

                    <div className="flex items-center">
                        <div className={`w-[90px] h-[20px] px-3 bg-[#146AFF] rounded-full flex items-center justify-center mr-2 ${houseColor}`}>
                            <span className="text-[11px] text-white">{house}</span>
                        </div>
                        <div className="w-[85px] h-[20px] px-3 bg-[#282B38] rounded-full flex items-center justify-center mr-2">
                            <span className="text-[11px] text-[#B0B6C9] truncate ">ID: #{id}</span>
                        </div>
                        <div className="w-[90px] h-[20px] px-3 bg-[#282B38] rounded-full flex items-center justify-center mr-2">
                            <span className="text-[11px] text-[#B0B6C9]">{description}</span>
                        </div>
                        <div className="h-[20px] px-3 bg-[#282B38] rounded-full flex items-center justify-center mr-2">
                            <span className="text-[11px] text-[#B0B6C9]">{value}</span>
                        </div>
                        {/* <div className="h-[20px] px-3 bg-[#15161D] border border-l-0 border-[#282B38] rounded-r-full flex items-center justify-center overflow-hidden">
                            <span className="text-[11px] text-[#B0B6C9] whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
                                {description}
                            </span>
                        </div> */}
                    </div>

                </div>

            </div>

            <div className="flex flex-col items-end gap-2 ml-2 mt-2">
                <div className="flex items-center gap-2">
                    <button disabled={isDisabledMetric} className={`flex items-center justify-center gap-2 w-[100px] h-[27px] text-xs text-[#B0B6C9] rounded-md bg-[#282B38] ${isMetricEnabled ? "opacity-100" : "opacity-50"}`}>
                        <img src="/eye.svg" alt="eye" className="w-3.5 h-3.5" />
                        Métricas
                    </button>

                    <button
                        disabled={!isEditable}
                        className={`flex items-center justify-center gap-2 h-[27px] text-xs rounded-md px-2
                                ${!isEditable
                                ? "opacity-50 text-[#667191] bg-[#15161D] border border-[#667191]"
                                : isActive
                                    ? "text-[#667191] bg-[#15161D] border border-[#667191]"
                                    : "text-white bg-gradient-to-r from-red-500 to-orange-500"
                            }`}>
                        <img
                            src={!isEditable ? "/edit.svg" : isActive ? "/edit.svg" : "/edit-2.svg"}
                            className="w-3 h-3"
                            alt="edit"
                        />
                        {isEditable ? (isActive ? "Editar" : "Editar resultados") : "Editar"}
                    </button>



                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-[30px] h-[27px] text-xs text-[#667191] rounded-md bg-[#15161D] border border-[#667191]">
                        <img src="/trash.svg" alt="trash" className="w-3.5 h-3.5" />
                    </button>
                </div>

                <ConfirmModal
                    isOpen={isModalOpen}
                    title="Confirmar exclusão"
                    description="Tem certeza que deseja excluir este jackpot?"
                    confirmText="Sim, excluir"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => setIsModalOpen(false)}
                />

                <div className="flex items-center gap-3 mt-7 mr-3">
                    {/* <div className="flex items-center gap-1">
                        <img src="/user.svg" alt="user" className="w-4 h-4" />
                        <span className="text-[11px] text-[#B0B6C9]">{user}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                        <img src="/calendar.svg" alt="calendar" className="w-4 h-4" />
                        <span className="text-[11px] text-[#B0B6C9]">{date}</span>
                    </div>
                </div>

            </div>

        </div>

    )
}