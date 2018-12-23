import { Match } from "./SaveMatchesRequest";
import { PlayerLeaderboardEntry } from "./PlayerLeaderboardEntry";

export class GetPlayerSeasonHistoryResponse {
  PlayerLeaderBoardEntries: PlayerLeaderboardEntry[];
  EggStats: EggStats;
}

export class EggStats {
  MatchesReceivedEgg: Match[];
  MatchesGivenEgg: Match[];
}
