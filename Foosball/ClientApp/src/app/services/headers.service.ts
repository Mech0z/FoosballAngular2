import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeadersService {
  constructor() { }
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
}
