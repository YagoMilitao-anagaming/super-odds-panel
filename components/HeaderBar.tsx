import SideForm from "./SideFormCreate";

type HeaderBarProps = {
    onFilterLast7Days?: () => void;
    filterActive?: boolean;
    onSearchChange?: (query: string) => void;
};

export default function HeaderBar({ onSearchChange, onFilterLast7Days, filterActive }: HeaderBarProps) {
    return (
        <div>
            <div className="inline-flex items-center gap-3 mt-5 mb-3 relative w-full">
                <h1 className="font-poppins font-bold text-3xl text-white">Bolão</h1>
                <img src="/info.svg" alt="info" className="w-4 h-4" />
                <SideForm />
            </div>


            <div className="flex items-center justify-end mt-2 relative w-full">
                <div className="relative">
                    <img
                        src="/search.svg"
                        alt="Pesquisar"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-[500px] h-[27px] mr-4 rounded-md border border-[#282B38] placeholder-[#667191] focus:outline-none focus:ring-0 py-2 pl-10 pr-4 text-xs text-[#667191]"
                    />
                </div>

                <button
                    onClick={onFilterLast7Days}
                    className={`
                    flex items-center gap-1 justify-center px-2 rounded-l-md border border-[#282B38]
                    ${filterActive ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-[#1C1F29] text-[#B0B6C9]'}
                    text-[10px] w-[120px] h-[27px] transition-all duration-300 ease-in-out active:scale-95`}
                >   Últimos 7 dias
                    {/* <img
                        src="/chevron-down.svg"
                        alt="Seta"
                        className="h-4 w-4 text-gray-400"
                    /> */}
                </button>

                <button className="flex items-center gap-1 px-2 justify-center rounded-r-md border border-[#282B38] bg-[#101116] text-[#B0B6C9] text-[9px] w-[140px] h-[27px]">
                    <img
                        src="/calendar.svg"
                        alt="Calendário"
                        className="h-3.5 w-3.5 text-gray-400"
                    />
                    08 Out - 14 Out 2025
                </button>

                <button disabled className="flex items-center gap-1 opacity-50 px-2 ml-2 justify-center rounded-md border border-[#282B38] bg-[#101116] text-[#B0B6C9] text-[9px] w-[90] h-[27px]">
                    <img
                        src="/sliders.svg"
                        alt="Sliders"
                        className="h-3.5 w-3.5 text-gray-400"
                    />
                    Filtrar
                </button>

            </div>

        </div>
    );
}

