import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent {
  public leaderboards: Leaderboard[];
  public selectedLeaderboard: Leaderboard;
  public players: User[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    http.get<User[]>('https://foosballapi.azurewebsites.net/' + 'api/Player/GetUsers').subscribe(result => {
      this.players = result;
      if (this.leaderboards != null) {
        this.setNames(this.players);
      }
    }, error => console.error(error));

    http.get<Leaderboard[]>('https://foosballapi.azurewebsites.net/' + 'api/leaderboard/index').subscribe(result => {
      this.leaderboards = result;
      this.leaderboards.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      this.selectedLeaderboard = this.leaderboards[this.leaderboards.length - 1];
      this.selectedLeaderboard = this.leaderboards[0];
      this.selectedLeaderboard.entries.sort((a, b) => b.eloRating - a.eloRating);

      if (this.players != null) {
        this.setNames(this.players);
      }
    }, error => console.error(error));
  }
  
  public setNames(players: User[]) {
    this.leaderboards.forEach(function (leaderboard) {
      leaderboard.entries.forEach(function (entry) {
        players.forEach(function(player) {
          if (player.email === entry.userName) {
            entry.displayName = player.username;
          }
        })
      });
    });
  }
}

interface User {
    id: string;
    email: string;
    username: string;
    gravatarEmail: string;
}

interface LeaderboardEntries {
  numberOfGames: number,
  userName:	string,
  wins: number,
  losses: number,
  eloRating: number,
  form: string;
  displayName: string;
}

interface Leaderboard {
  id: string;
  entries: LeaderboardEntries[];
  seasonName: string;
  timestamp: Date;
  startDate: string;
}
