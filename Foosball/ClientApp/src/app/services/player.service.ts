import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient) { }

  requestNewPassword(email: string) {
    return this.http.get('https://foosballapi.azurewebsites.net' + '/api/Player/RequestPassword/?email=' + email)
  }
}
