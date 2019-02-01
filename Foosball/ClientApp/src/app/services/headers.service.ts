import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeadersService {
  constructor() { }
  createHttpHeaders() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const devicename = this.getDeviceName();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': token,
      'DeviceName': devicename,
      'Email': username
    });
  }
  getUsername() {
    const username = localStorage.getItem('username');
    if (username != null) {
      return username;
    } else {
      return '';
    }
  }

  getRoles() {
    const roles = localStorage.getItem('roles');
    if (roles != null) {
      return roles;
    } else {
      return '';
    }
  }

  getDeviceName() {
    const deviceName = localStorage.getItem('deviceName');
    if (deviceName != null) {
      return deviceName;
    } else {
      const randomNumber = Math.floor(Math.random() * 100000);
      const newDeviceName = 'pwa' + randomNumber;
      localStorage.setItem('deviceName', newDeviceName);
      return newDeviceName;
    }
  }
}
