import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { LoginRequest } from '../models/LoginRequest';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>('https://foosballapi.azurewebsites.net' + '/api/Account/Login', new LoginRequest(username, password, "somewebsitename"))
            .map(response => {
                // login successful if there's a jwt token in the response
                if (response && response.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('token', JSON.stringify(response.token));
                  localStorage.setItem('tokenexpirytime', JSON.stringify(response.expirytime));
                  localStorage.setItem('roles', JSON.stringify(response.roles));
                }

                return response;
            });
    }

    logout() {
        // remove user from local storage to log user out
      localStorage.removeItem('token');
      localStorage.removeItem('tokenexpirytime');
      localStorage.removeItem('roles');
    }
}
