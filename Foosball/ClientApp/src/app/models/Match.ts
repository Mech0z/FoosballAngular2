import { MatchResult } from '../models/SaveMatchesRequest';

export class Match {
  id: string;
  timeStampUtc: Date;
  playerList: string[];
  matchResult: MatchResult;
  submittedBy: string;
  points: number;
}
