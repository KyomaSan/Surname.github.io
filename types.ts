export enum GameState {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export interface SurnameInfo {
  surname: string;
  origin: string;
  poem?: string;
}
