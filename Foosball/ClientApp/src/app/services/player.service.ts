import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';
import { ChangeEmailRequest } from '../models/ChangeEmailRequest';
import { User } from '../models/user.interface';
import { CreateUserRequest } from '../models/CreateUserRequest';
import { PartnerPercentResult } from '../models/PartnerPercentResult';
import { PlayerRankSeasonEntry } from '../models/PlayerRankSeasonEntry';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  requestNewPassword(email: string) {
    return this.http.get('/api/Player/RequestPassword?email=' + email);
  }

  changePassword(request: ChangePasswordRequest) {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Player/ChangePassword', request, { headers: headers });
  }

  createUser(request: CreateUserRequest) {
    return this.http.post('/api/Player/CreateUser', request);
  }

  getPlayersRanks(seasonName: string) {
    return this.http.get<PlayerRankSeasonEntry[]>('/api/PlayerRanks/GetPlayerRanks?seasonName=' + seasonName);
  }

  getPlayerRank(email: string, seasonName: string) {
    return this.http.get<PlayerRankSeasonEntry>('/api/PlayerRanks/GetPlayerRank?email=' + email + '&seasonName=' + seasonName);
  }

  changeEmail(newEmail: string) {
    const request = new ChangeEmailRequest(newEmail);
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Account/ChangeEmail', request, { headers: headers })
      .map(() => {
          localStorage.setItem('username', newEmail);
        });
  }

  getUsers() {
    return this.http.get<User[]>('/api/Player/GetUsers');
  }

  getPlayerHistory(email: string) {
    return this.http.get<GetPlayerSeasonHistoryResponse>('/api/Player/GetPlayerHistory?email=' + email);
  }

  getPartnerResult(email: string) {
    return this.http.get<PartnerPercentResult[]>('/api/Player/GetPlayerPartnerResults?email=' + email);
  }
}
