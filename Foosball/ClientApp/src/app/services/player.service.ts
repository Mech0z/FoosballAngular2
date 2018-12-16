import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { HeadersService } from './headers.service';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  requestNewPassword(email: string) {
    return this.http.get('https://foosballapi.azurewebsites.net' + '/api/Player/RequestPassword?email=' + email)
  }

  changePassword(request: ChangePasswordRequest, ) {
    var headers = this.headersService.createHttpHeaders();
    return this.http.post('https://foosballapi.azurewebsites.net' + '/api/Player/ChangePassword', request, { headers: headers });
  }
}
