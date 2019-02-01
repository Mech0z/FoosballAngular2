import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';

@Injectable()
export class AdministrationService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  startNewSeason() {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/SeasonsAdministration/StartNewSeason', null, { headers: headers });
  }

  recalculate() {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Leaderboard/ResetLeaderboard', null, { headers: headers });
  }
}
