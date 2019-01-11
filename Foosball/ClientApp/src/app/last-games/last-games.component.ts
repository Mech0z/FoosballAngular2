import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService, MatchService } from '../services/index';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { Match } from '../models/match';

@Component({
  selector: 'app-last-games',
  templateUrl: './last-games.component.html',
})
export class LastGamesComponent {
  errorMessage: string;
  loadingPlayers: boolean;
  loadingMatches: boolean;
  matches: Match[];
  players: User[];

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadingMatches = true;
    this.loadingPlayers = true;

    this.playerService.getUsers().subscribe(result => {
      this.players = result;
      this.loadingPlayers = false;
    }, error => {
      this.errorMessage = "Error in loading players: " + error.errorMessage;
      this.loadingPlayers = false;
    });
    this.matchService.getLatestMatches(10).subscribe(result => {
      this.matches = result;
      this.loadingMatches = false;

    }, error => {
      this.errorMessage = "Error in loading latest matches: " + error.errorMessage;
      this.loadingMatches = false;
      });
  }

  public getName(email: string) {
    var result = "";
    this.players.forEach(player => {
      if (player.email === email) {
        result = player.username;
      };
    });

    return result;
  };
}
