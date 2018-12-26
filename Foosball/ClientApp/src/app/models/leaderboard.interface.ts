export interface LeaderboardEntries {
  numberOfGames: number;
  userName:	string;
  wins: number;
  losses: number;
  eloRating: number;
  form: string;
  displayName: string;
}

export interface Leaderboard {
  id: string;
  entries: LeaderboardEntries[];
  seasonName: string;
  timestamp: Date;
  startDate: string;
}
