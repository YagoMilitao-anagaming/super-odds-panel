'use client'

import HeaderBar from "@/components/HeaderBar";
import MatchCard from "@/components/MatchCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { fetchAllJackpots } from "../features/jackpot/jackpotSlice";
import SideFormEdit from "@/components/SideFormEdit";

export default function MainList() {

    const dispatch = useAppDispatch();
    const { list, loading, error } = useAppSelector((state) => state.jackpot);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLast7Days, setFilterLast7Days] = useState(false);
    const [fade, setFade] = useState(true);


    const filteredList = list.filter((jackpot) => {
        const matchesSearch = jackpot.jackpotName.toLowerCase().includes(searchQuery);
        if (filterLast7Days) {
            const jackpotDate = new Date(jackpot.jackpotStartDate);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return jackpotDate >= sevenDaysAgo && matchesSearch;
        }
        return matchesSearch;
    });

    const handleFilterToggle = () => {
        setFade(false);
        setTimeout(() => {
            setFilterLast7Days(prev => !prev);
            setFade(true);
        }, 200);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query.toLowerCase());
    };

    useEffect(() => {
        dispatch(fetchAllJackpots());
    }, [dispatch]);

    return (
        <>
            <main className="overflow-y-auto custom-scrollbar h-screen transform transition-transform duration-500 ease-out pr-4">

                <HeaderBar onSearchChange={handleSearchChange} onFilterLast7Days={handleFilterToggle} filterActive={filterLast7Days} />

                {loading && (
                    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
                        <img src="/logo.svg" alt="Carregando..." className="w-10 h-10 mb-2 animate-spin" />
                        <p className="text-white text-xs">Carregando...</p>
                    </div>
                )}

                {error && <p className="text-red-500">Erro: {error}</p>}

                <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                    {filteredList.map((jackpot) => {
                        const totalValue = jackpot.prizes.reduce((acc, prize) => acc + prize.value, 0);
                        const has7k = jackpot.prizes.some(prize => prize.code_smartico === "6271111");
                        const hasCassino = jackpot.prizes.some(prize => prize.code_smartico === "6651071");

                        const house =
                            has7k ? "7K"
                                : hasCassino ? "Cassino"
                                    : "";

                        return (
                            <div
                                key={jackpot.jackpotId}
                                className="transition-all duration-300 ease-in-out transform hover:scale-[1.02] opacity-0 animate-fade-in"
                            >
                                <MatchCard
                                    id={jackpot.jackpotId}
                                    title={jackpot.jackpotName}
                                    status={jackpot.status}
                                    value={`R$ ${totalValue.toLocaleString('pt-BR')}`}
                                    house={house}
                                    date={new Date(jackpot.jackpotStartDate).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                    description={`${jackpot.plays.length} ${jackpot.plays.length === 1 ? 'Partida' : 'Partidas'}`}
                                />
                            </div>
                            
                        );
                    })}
                </div>
            </main>

        </>
    );
}
