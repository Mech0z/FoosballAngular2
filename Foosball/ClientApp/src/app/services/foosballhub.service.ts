import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class FoosballHubService {
    public connection: signalR.HubConnection;

    constructor(private http: HttpClient, private headersService: HeadersService) {
  }

  public connect() {
    if (this.connection == null) {
    this.connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .withUrl('https://foosballapi.azurewebsites.net/foosballHub')
    .build();

    this.connection.start().then(function () {
        console.log('Connected!');
        }).catch(function (err) {
        return console.error(err.toString());
        });
      }
    }
}
