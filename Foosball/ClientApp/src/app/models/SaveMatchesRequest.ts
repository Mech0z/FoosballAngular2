import { Match } from '../models/Match';

export class SaveMatchesRequest {
matches: Match[];
email: string;
}

export class MatchResult {
  constructor(team1Score: number, team2Score: number) {
    this.team1Score = team1Score;
    this.team2Score = team2Score;
    this.team1Won = team1Score > team2Score;
  }

  team1Score: number;
  team2Score: number;
  team1Won: boolean;
}
