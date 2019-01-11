import { Match } from "./Match";
import { PlayerLeaderboardEntry } from "./PlayerLeaderboardEntry";

export interface GetPlayerSeasonHistoryResponse {
  playerLeaderBoardEntries: PlayerLeaderboardEntry[];
  eggStats: EggStats;
}

export class EggStats {
  matchesReceivedEgg: Match[];
  matchesGivenEgg: Match[];
}
