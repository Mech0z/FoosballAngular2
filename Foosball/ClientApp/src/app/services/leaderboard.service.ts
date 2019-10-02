import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { Observable } from 'rxjs/Observable';
import { Season } from '../models/Season';

@Injectable()
export class LeaderboardService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  getSeasons(): Observable<Season[]> {
    const headers = this.headersService.createHttpHeaders();
    return this.http.get<Season[]>('/api/SeasonsAdministration/GetSeasonsAsync', { headers: headers });
  }
}
