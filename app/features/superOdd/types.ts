export interface SuperOdds {
  _id: string;
  bannerSrc?: string;
  odd: Odd;
  participants: Participants;
  oddLink: string;
  maxValue: number;
  betSlipLine: BetSlipLine;
  eventStartDate: Date;
}

export interface Participants {
  homeName: string;
  awayName: string;
}

export interface BetSlipLine {
  type: "anyToScore" | "firstToScore" | "toAssist";
  description: string;
  author: string;
}

export interface Odd {
  normal: string;
  super: string;
}

export interface SuperOddState {
  data: SuperOdds | null; 
  list: SuperOdds[];
  loading: boolean;
  error: string | null;
  success: boolean;
}


export type superOddResponse = SuperOdds;