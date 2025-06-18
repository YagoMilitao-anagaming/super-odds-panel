import React from "react";
import { MultiGuessPlay } from "./MultiGuessPlays";

type Props = {
  play: MultiGuessPlay;
  playNumber: number;
  isActive: boolean;
  onUpdate: (field: keyof MultiGuessPlay, value: any) => void;
  onMinimize: () => void;
  onRemove: () => void;
};

const MultiGuessPlayItem: React.FC<Props> = ({
  play,
  playNumber,
  isActive,
  onUpdate,
  onMinimize,
  onRemove
}) => {

  return (
    <div className="border border-[#3A4052] rounded p-2 bg-[#1C1F29] mb-4 ">
      {isActive ? (
        <>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Time da Casa</label>
              <input
                type="text"
                placeholder="Time da casa"
                value={play.homeTeam || ""}
                onChange={(e) => onUpdate("homeTeam", e.target.value)}
                className="w-full h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Time Visitante</label>
              <input
                type="text"
                placeholder="Time visitante"
                value={play.awayTeam || ""}
                onChange={(e) => onUpdate("awayTeam", e.target.value)}
                className="w-full h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Região</label>
              <input
                type="text"
                placeholder="Região"
                value={play.country || ""}
                onChange={(e) => onUpdate("country", e.target.value)}
                className="w-full h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Etapa</label>
              <input
                type="text"
                placeholder="Etapa"
                value={play.leagueId || ""}
                onChange={(e) => onUpdate("leagueId", e.target.value)}
                className="w-full h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
            <div className="w-[80px]">
              <label className="block text-xs text-[#B0B6C9] mb-1">Acertos</label>
              <input
                type="number"
                placeholder="0"
                value={play.hits}
                onChange={(e) => onUpdate("hits", parseInt(e.target.value) || 0)}
                className="w-full h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Data de Início</label>
              <input
                type="datetime-local"
                value={play.gameStartAt || ""}
                onChange={(e) => onUpdate("gameStartAt", e.target.value)}
                className="w-[160px] h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#B0B6C9] mb-1">Data de Fim</label>
              <input
                type="datetime-local"
                value={play.gameEndAt || ""}
                onChange={(e) => onUpdate("gameEndAt", e.target.value)}
                className="w-[160px] h-[30px] text-center text-[#667191] rounded-sm text-xs bg-[#15161D] border border-[#3A4052] px-2"
              />
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={onMinimize}
              className="px-4 w-full h-[30px] text-[11px] text-[#B0B6C9] border border-[#3A4052] rounded-sm bg-[#15161D] hover:bg-[#282B38]"
            >
              Salvar alterações
            </button>
          </div>
        </>

      ) : (
        <div className="flex justify-between items-center">
          <div>

            <p className="text-[10px] gap-2">
              <span className="text-[#B0B6C9]">Jogo {playNumber}</span> &nbsp;
              <span className="text-[#667191]">
                {new Date(play.gameStartAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                {" . "}
                {new Date(play.gameStartAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>

            <p className="text-[10px] text-[#667191] ">{play.homeTeam} x {play.awayTeam}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onMinimize} className="flex items-center justify-center gap-1 w-[60px] h-[20px] text-[10px] text-[#667191] border border-[#3A4052] rounded-sm bg-[#15161D]">
              <img src="/edit.svg" alt="edit" className="w-2.5 h-2.5" />
              Editar
            </button>
            <button type="button" onClick={onRemove} className="flex items-center justify-center w-[27px] h-[20px] text-xs text-[#667191] rounded-sm bg-[#15161D] border border-[#3A4052]">
              <img src="/trash.svg" alt="trash" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      )}
    </div>
  );
};

export default MultiGuessPlayItem;
