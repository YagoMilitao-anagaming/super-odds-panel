import React from "react";
import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import ConfirmModal from "./ConfirmModal";
import { SuperOdds } from "@/app/features/superOdd/types";
import toast from 'react-hot-toast';
import { deleteSuperOdd, fetchAllSuperOdds } from "@/app/features/superOdd/superOddSlice";
import { Tooltip } from 'react-tooltip'
import { truncateStringWithHover } from "@/app/utils/truncateStringWithHover";

interface MatchCardProps {
    SuperOddsData: SuperOdds;
    house: string;
    onEdit: (superOdd: SuperOdds) => void;
    /**
    status: string;
    value: string;
    house: string;
     */
    
};

export default function MatchCard({
   SuperOddsData,
   house,
   onEdit,
}: MatchCardProps) {

    const dispatch = useAppDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const status = (SuperOddsData as any).status || "unknown";
    const isMetricEnabled = status.toLower
    const isDisabledMetric = !isMetricEnabled 
    const isEditable = true
    /** const isEditable = status.toLowerCase() === "active" || status.toLowerCase() === "processing";
        const isActive = status.toLowerCase() === "active";
        const isProcessing = status.toLowerCase() === "processing";
    */
   
   

  const copyLinkToClipboard = () => {
    if (SuperOddsData.oddLink) {
      navigator.clipboard.writeText(SuperOddsData.oddLink)
        .then(() => {
          toast.success('Link copiado!', {
            duration: 2000,
          });
        })
        .catch((err) => {
          console.error('Erro ao copiar o link:', err);
          toast.error('Falha ao copiar o link.', {
            duration: 2000,
          });
        });
    }
  };

    const handleDelete = async () => {
        try {
            await dispatch(deleteSuperOdd(SuperOddsData._id)).unwrap();
            await dispatch(fetchAllSuperOdds());
        } catch (error) {
            console.error('Erro ao deletar superOdd:', error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const houseColor = {
        cassino: "bg-[#146AFF]",
        "7k": "bg-[#05764A]",
    }[house.toLowerCase()] || "bg-gray-500";

/**
 * const statusGame =
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
 */
    

    const formattedEventDate = new Date(SuperOddsData.eventStartDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });



    return (

        <div className="flex mt-8 w-[850px] bg-[#1C1F29] mx-auto px-4 py-3 rounded-2xl relative">
            <img
                src={`${SuperOddsData.bannerSrc}` || '/picture-box.svg'}
                alt="picture-box"
                className="w-[125px] h-[125px] rounded-lg flex items-center "
            /> 
            <div className="flex flex-col ml-4 mt-3 flex-1"> 
                <div className="flex items-center gap-1"> 
                    <h1 className="text-base font-medium text-[#B0B6C9]">
                        {`${SuperOddsData.participants.homeName} x ${SuperOddsData.participants.awayName} - ${SuperOddsData.betSlipLine.description}`}
                    </h1>
                    {/**
                     * <img src={statusGame} alt="status" className="w-[100px] h-[15px]" />
                     */}
                    
                </div>

               <div className="flex items-center gap-2 mt-1">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#B9DEFF29]  rounded-md">
                    <img src="/link.svg" alt="link" className="w-4 h-4" />
                    <span className="text-blue-200 text-sm font-normal">
                        {SuperOddsData.oddLink}
                    </span>
                </button>

                    <button
                        onClick={copyLinkToClipboard} 
                        className="w-20 h-7 gap-1 text-[11px] text-[#858FAB] rounded-md bg-[#15161D] border border-[#282B38]">
                        Copiar link
                    </button>
                </div>

                <div className="flex items-center justify-between mt-7">

                    <div className="flex items-center">
                        <div className={`w-[90px] h-[20px] px-3 bg-[#146AFF] rounded-full flex items-center justify-center mr-2 ${houseColor} gap-2.5` }>
                            <span className="text-[11px] text-white">{house}</span>
                        </div>
                        <div className="w-[85px] h-[20px] px-3 bg-[#282B38] rounded-full flex items-center justify-center mr-2 gap-2.5">
                           <span
                                id={`id-tooltip-${SuperOddsData._id}`}
                                className="text-[11px] text-[#B0B6C9] "
                            >
                                ID: #{truncateStringWithHover(SuperOddsData._id)}
                            </span>
                            <Tooltip
                                anchorSelect={`#id-tooltip-${SuperOddsData._id}`}
                                content={SuperOddsData._id}
                                place="bottom" 
                                variant="dark"
                               className="bg-[#282B38] text-[#B0B6C9] rounded-lg text-sm shadow-md"
                            />
                        </div>
                        <div className="w-[90px] h-[20px] px-3 bg-[#282B38] rounded-full flex items-center justify-center mr-2 gap-2.5">
                            <span className="text-[11px] text-[#B0B6C9]">odd: {SuperOddsData.odd.normal}</span>
                        </div>
                        <div className="h-5 px-2.5 py-1 bg-[#282B38] rounded-[42px] outline outline-1 outline-offset-[-1px] outline-gray-800 inline-flex justify-center items-center gap-2.5">
                            <span className="text-[11px] text-[#B0B6C9]">oddTurbinada: {SuperOddsData.odd.super}</span>
                        </div>
                        {/**
                         *  <div className="h-[20px] px-3 bg-[#15161D] border border-l-0 border-[#282B38] rounded-r-full flex items-center justify-center overflow-hidden">
                            <span className="text-[11px] text-[#B0B6C9] whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
                                {value}
                            </span>
                        </div>
                         */}
                       
                    </div>

                </div>

            </div>

            <div className="flex flex-col items-end gap-2 ml-2 mt-2">
                <div className="flex items-center gap-2">
                    <button 
                        disabled={isDisabledMetric} 
                        className={`flex items-center justify-center gap-2 w-[100px] 
                            shadow-[0px_10px_10px_0px_rgba(0,0,0,0.10)] h-[27px] text-xs text-[#B0B6C9]
                            rounded-md bg-[#282B38] ${isMetricEnabled ? "opacity-100" : "opacity-50"}
                        `}>
                        <img src="/eye.svg" alt="eye" className="w-3.5 h-3.5" />
                        Métricas
                    </button>

                    <button
                       onClick={() => onEdit(SuperOddsData)}
                        className={`flex items-center justify-center gap-2 h-[27px] text-xs rounded-md px-2 
                                    text-[#667191] bg-[#15161D] border border-[#667191]`}
                        disabled={!isEditable} 
                    > 
                        <img 
                            src={"/edit.svg"} 
                            className="w-3 h-3"
                            alt="edit"
                        /> 
                        Editar 
                    </button> 
 
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center shadow-[0px_10px_10px_0px_rgba(0,0,0,0.10)] 
                            justify-center w-[30px] h-[27px] text-xs text-[#667191] rounded-md 
                            bg-[#15161D] border border-[#667191]"
                        >
                        <img src="/trash.svg" alt="trash" className="w-3.5 h-3.5" />
                    </button>
                </div>

                <ConfirmModal
                    isOpen={isModalOpen}
                    title="Confirmar exclusão"
                    description="Tem certeza que deseja excluir esta superOdd? "
                    confirmText="Sim, excluir"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => setIsModalOpen(false)} 
                /> 
                <div className="flex items-center gap-3 mt-14 mr-3">
                    {/* <div className="flex items-center gap-1">
                        <img src="/user.svg" alt="user" className="w-4 h-4" />
                        <span className="text-[11px] text-[#B0B6C9]">{user}</span>
                    </div> */}
                    <div className="flex items-center gap-1"> 
                        <img src="/calendar.svg" alt="calendar" className="w-4 h-4" /> 
                        <span className="text-[11px] text-[#B0B6C9]">{formattedEventDate}</span>
                    </div> 
                </div> 
            </div> 
        </div> 
    ) 
} 