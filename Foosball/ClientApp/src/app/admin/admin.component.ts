import { Component } from '@angular/core';
import { AdministrationService } from '../services/administration.service';
import { UserMappingsResponseEntry } from '../models/UserMappingsResponseEntry';
import { ChangeUserRolesRequest } from '../models/ChangeUserRolesRequest';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  message: string;
  loading: boolean;
  selectedUser: UserMappingsResponseEntry;
  usersMappings: UserMappingsResponseEntry[];

  constructor(
    private administrationSerivce: AdministrationService  ) { }

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

  onUserMappingSelect(userMapping: UserMappingsResponseEntry) {
    this.selectedUser = userMapping;
    this.usersMappings = null;
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
