import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { HeadersService } from '../services/headers.service';
import { AdministrationService } from '../services/administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FoosballHubService } from '../services/foosballhub.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { PlayerService } from '../services/player.service';


@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.scss']
})
export class FetchDataComponent {
  public leaderboards: Leaderboard[];
  public selectedLeaderboard: Leaderboard;
  public players: User[];
  isAdmin = false;

  delay = false;

  constructor(http: HttpClient,
    private headerService: HeadersService,
    private administrationService: AdministrationService,
    private _snackBar: MatSnackBar,
    private foosballHubService: FoosballHubService,
    private leaderboardService: LeaderboardService,
    private playerService: PlayerService) {
      const roles = this.headerService.getRoles();
      if (roles.includes('Admin')) {
        this.isAdmin = true;
      }

    this.playerService.getUsers().subscribe(result => {
      this.players = result;
      if (this.leaderboards != null) {
        this.setNames(this.players);
      }
    }, error => console.error(error));

    this.getLeaderboardData();

    this.foosballHubService.connect();
    foosballHubService.connection.on('MatchAdded', () => {
      this.matchAddedEvent();
    });
  }

  private getLeaderboardData() {
    this.leaderboardService.getLeaderboards().subscribe(result => {
      this.leaderboards = result;
      if (this.players != null) {
        this.setNames(this.players);
        this.setSelectedLeaderboard();
        setTimeout(() => { this.delay = true; }, 100);
      }
    }, error => console.error(error));
  }

  private setSelectedLeaderboard() {
    this.selectedLeaderboard = this.leaderboards[this.leaderboards.length - 1];
    this.selectedLeaderboard = this.leaderboards[0];
    this.selectedLeaderboard.entries.sort((a, b) => b.eloRating - a.eloRating);
  }

  public matchAddedEvent() {
    this.getLeaderboardData();
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

  public recalculateSeason() {
    this.administrationService.recalculateSingleSeason(this.selectedLeaderboard.seasonName).subscribe(() => {
      this._snackBar.open('Season has been recalculated, please reload', '', {
        duration: 3000
      });
    }, error => console.error(error));
  }
}
