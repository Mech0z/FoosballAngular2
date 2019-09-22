import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { SaveMatchesRequest } from '../models/SaveMatchesRequest';
import { Match } from '../models/Match';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  submitMatch(request: SaveMatchesRequest) {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Match/SaveMatch', request, { headers: headers });
  }

  getLatestMatches(count: number): Observable<Match[]> {
    return this.http.get<Match[]>('/api/Match/LastGames?numberOfMatches=' + count);
  }

  getPlayerLatestMatches(email: string): Observable<Match[]> {
    return this.http.get<Match[]>('/api/Player/GetPlayerMatches?email=' + email);
  }

  deleteMatch(matchId: string) {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Match/DeleteMatch?matchId=' + matchId, null, { headers: headers });
  }
}
