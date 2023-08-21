export interface IRegister {
  players: string[];
}

export interface IGiveCoins {
  playerName: string;
  amount: number;
}

export interface IGetPlayer {
  playerName: string;
}

export interface ITransferCoins {
  from: string;
  to: string;
  amount: number;
}
