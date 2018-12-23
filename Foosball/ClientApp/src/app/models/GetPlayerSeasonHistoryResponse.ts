import { Match } from "./SaveMatchesRequest";

export class GetPlayerSeasonHistoryResponse {
  PlayerLeaderBoardEntries: Match[];
  EggStats: string;
}

export class EggStats {
  MatchesReceivedEgg: Match[];
  MatchesGivenEgg: Match[];
}
