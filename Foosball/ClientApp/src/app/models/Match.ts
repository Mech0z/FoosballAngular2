import { MatchResult } from '../models/SaveMatchesRequest';

export class Match{
  timeStampUtc: Date;
  playerList: string[];
  matchResult: MatchResult;
  submittedBy: string;
  points: number;
}
