import React, { useState } from "react";
import MultiGuessPlayItem from "./MultiGuessPlayItem";

export type MultiGuessPlay = {
  id: number;
  leagueId: string;
  homeTeam: string;
  awayTeam: string;
  country: string;
  gameStartAt: string;
  gameEndAt?: string;
  hits: number;
  template: {
    name: string;
    questions: Array<{
      question_id: string;
      question_text: string;
      question_type: string;
      options: {
        home: any[];
        away: any[];
      };
    }>;
  };
};

type Props = {
  plays: MultiGuessPlay[];
  setPlays: React.Dispatch<React.SetStateAction<MultiGuessPlay[]>>;
};

const MultiGuessPlays: React.FC<Props> = ({ plays, setPlays }) => {
  
  const [activePlayId, setActivePlayId] = useState<number | null>(null);

  const updatePlay = (id: number, field: keyof MultiGuessPlay, value: any) => {
    setPlays(prev =>
      prev.map(play =>
        play.id === id ? { ...play, [field]: value } : play
      )
    );
  };

  const removePlay = (id: number) => {
    setPlays(prev => prev.filter(play => play.id !== id));
    if (activePlayId === id) setActivePlayId(null);
  };

  return (
    <div className="mt-4">
      {plays.map((play, index) => (
        <MultiGuessPlayItem
          key={play.id}
          play={play}
          isActive={activePlayId === play.id}
          playNumber={index + 1}
          onUpdate={(field, value) => updatePlay(play.id, field, value)}
          onMinimize={() => setActivePlayId(play.id === activePlayId ? null : play.id)}
          onRemove={() => removePlay(play.id)}
        />
      ))}
    </div>
  );
};

export default MultiGuessPlays;
