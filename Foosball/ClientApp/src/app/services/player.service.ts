import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  requestNewPassword(email: string) {
    return this.http.get('/api/Player/RequestPassword?email=' + email)
  }

  changePassword(request: ChangePasswordRequest) {
    var headers = this.headersService.createHttpHeaders();
    return this.http.post('/api/Player/ChangePassword', request, { headers: headers });
  }

  getPlayerHistory(email: string) {
    return this.http.get<GetPlayerSeasonHistoryResponse>('/api/Player/GetPlayerHistory?email=' + email);
  }
}
