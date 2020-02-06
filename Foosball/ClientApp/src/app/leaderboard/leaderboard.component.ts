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
import { take, finalize } from 'rxjs/operators';


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
  hilightPodium: boolean;
  loading: boolean;
  isAdmin: boolean;


  constructor(
    private headerService: HeadersService,
    private administrationService: AdministrationService,
    private _snackBar: MatSnackBar,
    private foosballHubService: FoosballHubService,
    private leaderboardService: LeaderboardService,
    private playerService: PlayerService) { }

  ngOnInit(): void {
    this.loading = true;

    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }
    combineLatest(
      this.playerService.getUsers(),
      this.leaderboardService.getLeaderboards()
    ).pipe(take(1), finalize(() => this.loading = false))
      .subscribe(([players, leaderboards]) => {
        this.players = players;
        this.leaderboards = leaderboards;

        this.setNames(this.players);
        this.setSelectedLeaderboard();
        setTimeout(() => this.hilightPodium = true);
      });

    this.foosballHubService.connect();
    this.foosballHubService.connection.on('MatchAdded', () => {
      this.refreshData();
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private getLeaderboardData() {
    this.loading = true;
    this.leaderboardService.getLeaderboards().pipe(take(1), finalize(() => this.loading = false)).subscribe(result => {
      this.leaderboards = result;
      if (this.players != null) {
        this.setNames(this.players);
        this.setSelectedLeaderboard();
      }
      setTimeout(() => this.hilightPodium = true);
    }, error => console.error(error));
  }

  private setSelectedLeaderboard() {
    this.selectedLeaderboard = this.leaderboards[this.leaderboards.length - 1];
    this.selectedLeaderboard = this.leaderboards[0];
    this.selectedLeaderboard.entries.sort((a, b) => b.eloRating - a.eloRating);
  }

  public refreshData() {
    this.hilightPodium = false;
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
