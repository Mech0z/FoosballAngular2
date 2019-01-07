import { Match } from "./Match";
import { PlayerLeaderboardEntry } from "./PlayerLeaderboardEntry";

export interface GetPlayerSeasonHistoryResponse {
  PlayerLeaderBoardEntries: PlayerLeaderboardEntry[];
  EggStats: EggStats;
}

export class EggStats {
  MatchesReceivedEgg: Match[];
  MatchesGivenEgg: Match[];
}
