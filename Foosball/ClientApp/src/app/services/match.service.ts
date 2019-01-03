import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { SaveMatchesRequest } from '../models/SaveMatchesRequest';

@Injectable()
export class MatchService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  submitMatch(request: SaveMatchesRequest) {
    var headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Match/SaveMatch', request, { headers: headers });
  }
}
