import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginRequest, LoginResponse } from '../models/LoginRequest';
import { HeadersService } from './headers.service';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>('/api/Account/Login', new LoginRequest(username, password, this.headersService.getDeviceName()))
      .map(response => {
        // login successful if there's a jwt token in the response
        if (response.loginFailed) {
          return response;
        }
        if (response) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenexpirytime', response.expiryTime.toString());
          localStorage.setItem('roles', response.roles.toString());
        }

        return response;
      });
  }

  checkLogin() {
    const username = localStorage.getItem('username');
    if (username != null) {
      return username;
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('tokenexpirytime');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
  }

  validateLogin() {
    const headers = this.headersService.createHttpHeaders();
    return this.http.post<LoginResponse>('/api/Account/ValidateLogin', null, { headers: headers })
      .map(response => {
        // login successful if there's a jwt token in the response
        if (response.loginFailed) {
          this.logout();
          window.location.reload();
          return response;
        }
        if (response) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('tokenexpirytime', response.expiryTime.toString());
          localStorage.setItem('roles', response.roles.toString());
        }

        return response;
      });
  }
}
