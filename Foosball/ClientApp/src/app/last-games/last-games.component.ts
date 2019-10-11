import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.interface';
import { Match } from '../models/match';
import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';
import { HeadersService } from '../services/headers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LastGamesDialogComponent } from './last-games-dialog.component';

@Component({
  selector: 'app-last-games',
  templateUrl: './last-games.component.html',
  styleUrls: ['./last-games.component.css']
})
export class LastGamesComponent implements OnInit {
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
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(LastGamesDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matchService.deleteMatch(match.id).subscribe(() => {
          this.getLatestGames();
          this._snackBar.open('Match has been deleted!', '', {
            duration: 5000
          });
        }, error => {
          this.errorMessage = 'Error deleting match: ' + error.errorMessage;
        });
      }
    });
  }
}
