import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient) { }

  requestNewPassword(email: string) {
    return this.http.get('https://foosballapi.azurewebsites.net' + '/api/Player/RequestPassword?email=' + email)
  }

  createHttpHeaders() {
    var username = localStorage.getItem('username');
    var token = localStorage.getItem('token');
    var devicename = 'somewebsitename';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': token,
      'DeviceName': devicename,
      'Email': username
    });
  }

  changePassword(request: ChangePasswordRequest, ) {
    var headers = this.createHttpHeaders();
    return this.http.post('https://foosballapi.azurewebsites.net' + '/api/Player/ChangePassword', request, { headers: headers });
  }
}
