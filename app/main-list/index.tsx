'use client'

import HeaderBar from "@/components/HeaderBar";
import MatchCard from "@/components/MatchCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { fetchAllSuperOdds } from "@/app/features/superOdd/superOddSlice";
import { SuperOdds } from "../features/superOdd/types";
import SuperOddForm from "../superOdd-form";

export default function MainList() {

    const dispatch = useAppDispatch(); 
    const { list, loading, error } = useAppSelector((state) => state.superOdd);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filterLast7Days, setFilterLast7Days] = useState(false); 
    const [fade, setFade] = useState(true); 
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSuperOdd, setEditingSuperOdd] = useState<SuperOdds | null>(null);

    const filteredList = list.filter(
        (superOdd: {
             participants: {
                 homeName: any; 
                 awayName: any; 
            }; 
            betSlipLine: {
                description: any; 
            }; 
            oddLink: any;
            eventStartDate: string | number | Date; 
        }) =>{ 
            const searchableText = `${superOdd.participants?.homeName ?? ''} ${superOdd.participants?.awayName ?? ''} ${superOdd.betSlipLine?.description ?? ''} ${superOdd.oddLink ?? ''}`.toLowerCase(); 
            const matchesSearch = searchableText.includes(searchQuery);

            if (filterLast7Days) {
                const eventDate = new Date(superOdd.eventStartDate);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 
                return eventDate >= sevenDaysAgo && matchesSearch;
            } 
            return matchesSearch; 
            }
    ); 

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
 
    const handleEditSuperOdd = (superOdd: SuperOdds) => {
        setEditingSuperOdd(superOdd)
        setIsFormOpen(true)
    };
 
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingSuperOdd(null);
    };

    useEffect(() => { 
        dispatch(fetchAllSuperOdds());
    }, [dispatch]); 

    return ( 
        <> 
            <main className="overflow-y-auto custom-scrollbar h-screen transform transition-transform duration-500 ease-out pr-4"> 

                <HeaderBar 
                    onSearchChange={handleSearchChange} 
                    onFilterLast7Days={handleFilterToggle} 
                    filterActive={filterLast7Days} 
                />

                {loading && ( 
                    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50"> 
                        <img src="/logo.svg" alt="Carregando..." className="w-10 h-10 mb-2 animate-spin" /> 
                        <p className="text-white text-xs">Carregando...</p> 
                    </div> 
                )} 

                {error && <p className="text-red-500 text-center mt-4">Erro: {error}</p>}

                <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                    {filteredList.length === 0 && !loading && !error ? (
                        <p className="text-gray-400 text-center mt-8">Nenhuma SuperOdd encontrada. {searchQuery && `Para "${searchQuery}"`}</p>
                    ) : (
                        filteredList.map((superOdd: SuperOdds) => {
                            const house = "Cassino"; 
                            return (
                                <div
                                    key={superOdd._id}
                                    className="transition-all duration-300 ease-in-out transform hover:scale-[1.02] opacity-0 animate-fade-in"
                                >
                                    <MatchCard
                                        key={superOdd._id}
                                        SuperOddsData={superOdd}
                                        house={house}
                                        onEdit={handleEditSuperOdd}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </main> 
           {isFormOpen && (
                <div className={`
                    fixed inset-0 z-50
                    bg-black bg-opacity-75 // Overlay escuro
                    flex items-center justify-center // Centraliza em desktop
                    sm:justify-end sm:items-stretch
                    `}>
                    <SuperOddForm
                        onClose={handleCloseForm}
                        superOddToEdit={editingSuperOdd}
                    />
                </div>
            )}
        </>
    );
}