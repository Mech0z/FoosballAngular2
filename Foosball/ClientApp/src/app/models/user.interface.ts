export interface User {
  id: string;
  email: string;
  username: string;
  gravatarEmail: string;


  currentElo: number;
  isSelected: boolean;
  noElo: boolean;
}
