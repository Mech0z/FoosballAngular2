import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { Observable } from 'rxjs/Observable';
import { GetUserMappingsResponse } from '../models/GetUserMappingsResponse';
import { ChangeUserRolesRequest } from '../models/ChangeUserRolesRequest';
import { Match } from '../models/Match';

@Injectable()
export class AdministrationService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  startNewSeason() {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/SeasonsAdministration/StartNewSeason', null, { headers: headers });
  }

  recalculate() {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Leaderboard/ResetLeaderboards', null, { headers: headers });
  }

  recalculateSingleSeason(seasonName: string) {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Leaderboard/ResetLeaderboard?seasonName=' + seasonName, null, { headers: headers });
  }

  getUserMappings(): Observable<GetUserMappingsResponse> {
    const headers = this.headersService.createHttpHeaders();
    return this.http.get<GetUserMappingsResponse>('/api/Administration/GetUserMappings', { headers: headers });
  }

  getDeletedMatches(): Observable<Match[]> {
    const headers = this.headersService.createHttpHeaders();
    return this.http.get<Match[]>('/api/Match/GetDeletedMatchesAsync', { headers: headers });
  }

  addPlayerRole(request: ChangeUserRolesRequest) {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Administration/ChangeUserRoles', request, { headers: headers });
  }
}
