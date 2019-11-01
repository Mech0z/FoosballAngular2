import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdministrationService } from '../services/administration.service';
import { UserMappingsResponseEntry } from '../models/UserMappingsResponseEntry';
import { ChangeUserRolesRequest } from '../models/ChangeUserRolesRequest';
import { Match } from '../models/Match';
import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';
import { User } from '../models/user.interface';
import { LastGamesDialogComponent } from '../last-games/last-games-dialog.component';
import { Season } from '../models/Season';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UpsertSeasonRequest } from '../models/UpsertSeasonRequest';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  message: string;
  deletedMessage: string;
  rolesMessage: string;
  loading: boolean;
  selectedUser: UserMappingsResponseEntry;
  usersMappings: UserMappingsResponseEntry[];
  deletedMatches: Match[];
  seasons: Season[];
  newSeason: Season;
  players: User[];

  constructor(
    private administrationSerivce: AdministrationService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.subs.push(
      this.playerService.getUsers().subscribe(result => {
        this.players = result;
      }, error => {
        this._snackBar.open('Error in loading players: ' + error.errorMessage, '', {
          duration: 3000
        });
      })
    );
    this.newSeason = new Season();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  startNewSeason() {
    this.loading = true;
    console.error(this.newSeason.name);
    console.error(this.newSeason.startDate);
    const request = new UpsertSeasonRequest(this.newSeason.name, this.newSeason.startDate);
    this.subs.push(
      this.administrationSerivce.startNewSeason(request).subscribe(() => {
        this.loading = false;
      }, error => {
        this.loading = false;
        this.message = error.message;
      })
    );
  }

  resetLeaderboard() {
    this.loading = true;
    this.subs.push(
      this.administrationSerivce.recalculate().subscribe(() => {
        this.loading = false;

      }, error => {
        this.loading = false;
        this.message = error.message;
      })
    );
  }

  getUserMappingsResponse() {
    this.loading = true;
    this.rolesMessage = '';
    this.subs.push(
      this.administrationSerivce.getUserMappings().subscribe(result => {
        this.loading = false;
        this.usersMappings = result.users;
      }, error => {
        this.loading = false;
        this.rolesMessage = error.message;
      })
    );
  }

  getSeasons() {
    this.loading = true;
    this.deletedMessage = '';
    this.subs.push(
      this.administrationSerivce.getSeasons().subscribe(result => {
        this.loading = false;
        this.seasons = result.sort(function (a, b) {
          return a.startDate > b.startDate ? 0 : 1;
        });
        this.seasons = result;
        if (this.seasons.length === 0) {
          this._snackBar.open('No seasons found!', '', {
            duration: 3000
          });
        }
      })
    );
  }

  seasonDateChanged(event: MatDatepickerInputEvent<Date>) {
    this.newSeason.startDate = event.value;
  }

  seasonStarted(season: Season) {
    if (new Date(season.startDate).getTime() > Date.now()) {
      return true;
    } else {
      return false;
    }
  }

  getDeletedMatches() {
    this.loading = true;
    this.deletedMessage = '';
    this.subs.push(
      this.administrationSerivce.getDeletedMatches().subscribe(result => {
        this.loading = false;
        this.deletedMatches = result;
        if (this.deletedMatches.length === 0) {
          this._snackBar.open('No deleted matches found!', '', {
            duration: 3000
          });
        }
      }, error => {
        this.loading = false;
        this.deletedMessage = error.message;
      })
    );
  }

  onUserMappingSelect(userMapping: UserMappingsResponseEntry) {
    this.selectedUser = userMapping;
    this.usersMappings = null;
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

  addPlayerRole() {
    this.loading = true;
    let request = null;
    if (this.selectedUser.roles === null) {
      const roles: string[] = ['Player'];
      request = new ChangeUserRolesRequest(this.selectedUser.email, roles);
    } else if (this.selectedUser.roles.indexOf('Player') === -1) {
      this.selectedUser.roles.push('Player');
      request = new ChangeUserRolesRequest(this.selectedUser.email, this.selectedUser.roles);
    }

    if (request != null) {
      this.subs.push(
        this.administrationSerivce.addPlayerRole(request).subscribe(() => {
          this.loading = false;
          this.selectedUser = null;
        }, error => {
          this.loading = false;
          this.message = error.message;
        })
      );
    } else {
      this._snackBar.open('User already have this role: ', '', {
        duration: 3000
      });
    }
  }

  public undeleteMatch(match: Match) {
    const dialogRef = this.dialog.open(LastGamesDialogComponent);

    this.subs.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.matchService.undeleteMatch(match.id).subscribe(() => {
            this.getDeletedMatches();
            this._snackBar.open('Match has been undeleted!', '', {
              duration: 3000
            });
          }, error => {
            this._snackBar.open('Error deleting match: ' + error.errorMessage, '', {
              duration: 3000
            });
            this.deletedMessage = 'Error deleting match: ' + error.errorMessage;
          });
        }
      })
    );
  }

  deleteUnstartedSeason() {
    alert('Fejl 40, pga. noget Mads har glemt at gøre');
    throw(new Error('Not implemented'));
  }
}
