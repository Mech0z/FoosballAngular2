import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { HeadersService } from '../services/headers.service';


@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent {
  public leaderboards: Leaderboard[];
  public selectedLeaderboard: Leaderboard;
  public players: User[];
  isAdmin = false;

  constructor(http: HttpClient,
    private headerService: HeadersService) {
      const roles = this.headerService.getRoles();
      if (roles.includes('Admin')) {
        this.isAdmin = true;
      }

    http.get<User[]>('/api/Player/GetUsers').subscribe(result => {
      this.players = result;
      if (this.leaderboards != null) {
        this.setNames(this.players);
      }
    }, error => console.error(error));

    http.get<Leaderboard[]>('/api/leaderboard/index').subscribe(result => {
      this.leaderboards = result;
      this.selectedLeaderboard = this.leaderboards[this.leaderboards.length - 1];
      this.selectedLeaderboard = this.leaderboards[0];
      this.selectedLeaderboard.entries.sort((a, b) => b.eloRating - a.eloRating);

      if (this.players != null) {
        this.setNames(this.players);
      }
    }, error => console.error(error));
  }

  public setNames(players: User[]) {
    this.leaderboards.forEach(leaderboard => {
      leaderboard.entries.forEach(entry => {
        players.forEach(player => {
          if (player.email === entry.userName) {
            entry.displayName = player.username;
          }
        });
      });
    });
  }
}
