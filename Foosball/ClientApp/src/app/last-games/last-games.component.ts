import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.interface';
import { Match } from '../models/match';
import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';
import { HeadersService } from '../services/headers.service';

@Component({
  selector: 'app-last-games',
  templateUrl: './last-games.component.html'
})
export class LastGamesComponent implements OnInit{
  errorMessage: string;
  loadingPlayers: boolean;
  loadingMatches: boolean;
  matches: Match[];
  players: User[];
  isAdmin = false;

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private headerService: HeadersService,
  ) {
  }

  ngOnInit() {
    this.getLatestGames();
  }

  public getLatestGames() {
    this.loadingMatches = true;
    this.loadingPlayers = true;

    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }

    this.playerService.getUsers().subscribe(result => {
      this.players = result;
      this.loadingPlayers = false;
    }, error => {
      this.errorMessage = 'Error in loading players: ' + error.errorMessage;
      this.loadingPlayers = false;
    });
    this.matchService.getLatestMatches(10).subscribe(result => {
      this.matches = result;
      this.loadingMatches = false;

    }, error => {
      this.errorMessage = 'Error in loading latest matches: ' + error.errorMessage;
      this.loadingMatches = false;
      });
  }

  public getName(email: string) {
    let result = '';
    this.players.forEach(player => {
      if (player.email === email) {
        result = player.username;
      }
    });

    return result;
  }

  public deleteMatch(match: Match) {
    this.matchService.deleteMatch(match.id).subscribe(() => {
      this.getLatestGames();
    }, error => {
      this.errorMessage = 'Error deleting match: ' + error.errorMessage;
      });
  }
}
