import { Component, OnInit, OnDestroy } from '@angular/core';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { HeadersService } from '../services/headers.service';
import { AdministrationService } from '../services/administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FoosballHubService } from '../services/foosballhub.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { PlayerService } from '../services/player.service';
import { Subscription, combineLatest } from 'rxjs';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  public leaderboards: Leaderboard[];
  public selectedLeaderboard: Leaderboard;
  public players: User[];
  hilightPodium = false;
  isAdmin = false;

  delay = false;

  constructor(
    private headerService: HeadersService,
    private administrationService: AdministrationService,
    private _snackBar: MatSnackBar,
    private foosballHubService: FoosballHubService,
    private leaderboardService: LeaderboardService,
    private playerService: PlayerService) { }

  ngOnInit(): void {
    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }

    this.subs.push(
      combineLatest(
        this.playerService.getUsers(),
        this.leaderboardService.getLeaderboards()
      ).subscribe(([players, leaderboards]) => {
        this.players = players;
        this.leaderboards = leaderboards;

        this.setNames(this.players);
        this.setSelectedLeaderboard();
        setTimeout(() => this.hilightPodium = true);
      })
    );

    this.foosballHubService.connect();
    this.foosballHubService.connection.on('MatchAdded', () => {
      this.onMatchAdded();
    });
  }
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  private getLeaderboardData() {
    this.subs.push(
      this.leaderboardService.getLeaderboards().subscribe(result => {
        this.leaderboards = result;
        if (this.players != null) {
          this.setNames(this.players);
          this.setSelectedLeaderboard();
        }
      }, error => console.error(error))
    );
  }

  private setSelectedLeaderboard() {
    this.selectedLeaderboard = this.leaderboards[this.leaderboards.length - 1];
    this.selectedLeaderboard = this.leaderboards[0];
    this.selectedLeaderboard.entries.sort((a, b) => b.eloRating - a.eloRating);
  }

  public onMatchAdded() {
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
    this.subs.push(
      this.administrationService.recalculateSingleSeason(this.selectedLeaderboard.seasonName).subscribe(() => {
        this._snackBar.open('Season has been recalculated, please reload', '', {
          duration: 3000
        });
      }, error => console.error(error))
    );
  }
}