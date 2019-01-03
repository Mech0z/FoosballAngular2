import { LeaderboardEntry } from "./LeaderboardEntry";

export interface Leaderboard {
  id: string;
  entries: LeaderboardEntry[];
  seasonName: string;
  timestamp: Date;
  startDate: string;
}
