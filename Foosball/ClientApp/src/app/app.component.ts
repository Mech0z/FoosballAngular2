import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Foosball';
  constructor(private swUpdate: SwUpdate) {

  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
    }

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('https://betafoosballapi.azurewebsites.net/activitySensorHub')
      .build();

    connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on('SendMessageToClient', (type: string, payload: string) => {
      console.error({ severity: type, summary: payload, detail: 'Via SignalR' });
    });
  }
}
