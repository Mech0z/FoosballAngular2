import { Component } from '@angular/core';
import { AdministrationService } from '../services/administration.service';
import { UserMappingsResponseEntry } from '../models/UserMappingsResponseEntry';
import { ChangeUserRolesRequest } from '../models/ChangeUserRolesRequest';
import { Match } from '../models/Match';
import { PlayerService } from '../services/player.service';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  message: string;
  loading: boolean;
  selectedUser: UserMappingsResponseEntry;
  usersMappings: UserMappingsResponseEntry[];
  deletedMatches: Match[];
  players: User[];

  constructor(
    private administrationSerivce: AdministrationService,
    private playerService: PlayerService ) { 
      this.playerService.getUsers().subscribe(result => {
        this.players = result;
      }, error => {
        this.message = 'Error in loading players: ' + error.errorMessage;
      });
    }

  startNewSeason() {
    this.loading = true;
    this.administrationSerivce.startNewSeason().subscribe(() => {
      this.loading = false;

    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }

  resetLeaderboard() {
    this.loading = true;
    this.administrationSerivce.recalculate().subscribe(() => {
      this.loading = false;

    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }

  getUserMappingsResponse() {
    this.loading = true;
    this.message = '';
    this.administrationSerivce.getUserMappings().subscribe(result => {
      this.loading = false;
      this.usersMappings = result.users;
    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }

  getDeletedMatches() {
    this.loading = true;
    this.message = '';
    this.administrationSerivce.getDeletedMatches().subscribe(result => {
      this.loading = false;
      this.deletedMatches = result;
    }, error => {
      this.loading = false;
      this.message = error.message;
    });
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
      this.administrationSerivce.addPlayerRole(request).subscribe(() => {
        this.loading = false;
        this.selectedUser = null;
      }, error => {
        this.loading = false;
        this.message = error.message;
    });
    } else {
      this.message = 'User already have this role';
    }
  }
}
