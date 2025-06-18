'use client'

import HeaderBar from "@/components/HeaderBar";
import MatchCard from "@/components/MatchCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { fetchAllJackpots } from "../features/jackpot/jackpotSlice";

export default function MainList() {

    const dispatch = useAppDispatch();
    const { list, loading, error } = useAppSelector((state) => state.jackpot);

    // State to manage the filter for the last 7 days
    const [filterLast7Days, setFilterLast7Days] = useState(false);
    const [fade, setFade] = useState(true);
    const filteredList = filterLast7Days
        ? list.filter(jackpot => {
            const jackpotDate = new Date(jackpot.jackpotStartDate);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return jackpotDate >= sevenDaysAgo;
        })
        : list;

    const handleFilterToggle = () => {
        setFade(false); // inicia fade-out
        setTimeout(() => {
            setFilterLast7Days(prev => !prev);
            setFade(true);
        }, 200);
    };

    useEffect(() => {
        dispatch(fetchAllJackpots());
    }, [dispatch]);



    return (
        <main className="overflow-y-auto custom-scrollbar h-screen transform transition-transform duration-500 ease-out pr-4">

            <HeaderBar onFilterLast7Days={handleFilterToggle} filterActive={filterLast7Days} />

            {loading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
                    <img src="/logo.svg" alt="Carregando..." className="w-10 h-10 mb-2 animate-spin" />
                    <p className="text-white text-xs">Carregando...</p>
                </div>
            )}

            {error && <p className="text-red-500">Erro: {error}</p>}

            <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                {filteredList.flatMap((jackpot) =>
                    jackpot.plays.map((play) => {

                        const totalValue = jackpot.prizes.reduce((acc, prize) => acc + prize.value, 0);
                        const has7k = jackpot.prizes.some(prize => prize.code_smartico === "6271111");
                        const hasCassino = jackpot.prizes.some(prize => prize.code_smartico === "6651071");

                        const house =
                            has7k ? "7K"
                                : hasCassino ? "Cassino"
                                    : "";

                        return (
                            <MatchCard
                                key={play.playId}
                                id={jackpot.jackpotId}
                                playId={play.playId}
                                title={play.templateName}
                                status={jackpot.status}
                                value={`R$ ${totalValue.toLocaleString('pt-BR')}`}
                                house={house}
                                date={new Date(jackpot.jackpotStartDate).toLocaleDateString
                                    ('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                description="vazio por enquanto"
                            />
                        );
                    })
                )}
            </div>
        </main>
    );
}

