export interface JackpotState {
  data: JackpotResponse | null;
  list: JackpotResponse[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface JackpotPayload {
  jackpotName: string;
  jackpotStartDate: string;
  jackpotType: 'single-guess-mode' | 'all-open-mode';
  prizes: Prize[];
  plays: Play[];
}

export interface Prize {
  type: 'Freebet' | 'Saldo real';
  code_smartico: string;
  value: number;
  description: string;
  hits: number;
}

export interface Play {
  leagueId: string;
  homeTeam: string;
  awayTeam: string;
  country: string;
  gameStartAt: string;
  gameEndAt?: string;
  template: {
    name: string;
    questions: Question[];
  };
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: string;
  options: {
    home: any[];
    away: any[];
  };
}

// JackpotResponse interface represents the structure of a jackpot object

export interface JackpotResponse {
  jackpotId: string;
  jackpotName: string;
  status: string;
  jackpotType: string;
  jackpotStartDate: string;
  finishedAt: string | null;
  smarticoReady: boolean;
  bonusDistributed: boolean;
  prizes: PrizeResponse[];
  plays: PlayResponse[];
}

export interface PrizeResponse {
  type: string;
  code_smartico: string;
  value: number;
  description: string;
  hits: number;
}

export interface PlayResponse {
  playId: string;
  leagueId: string;
  templateName: string;
  templateId: string;
  homeTeam: string;
  awayTeam: string;
  country: string;
  gameStartAt: string;
  gameEndAt: string;
  status: string;
  questions: QuestionResponse[];
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  options: {
    home: any[];
    away: any[];
  };
  correctAnswer: string | null;
}
