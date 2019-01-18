import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LastGamesComponent } from './last-games/last-games.component';
import { OnlineComponent } from './online/online.component';

import { AlertService, AuthenticationService, PlayerService, HeadersService } from './services/index';
import { RequestPasswordComponent } from './requestpassword/requestpassword.component';
import { ApiInterceptor } from './services/ApiInterceptor';
import { MatchService } from './services/match.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChangeEmailComponent } from './change-email/change-email.component';

@
  NgModule({
    declarations: [
      AppComponent,
      NavMenuComponent,
      HomeComponent,
      CounterComponent,
      FetchDataComponent,
      LoginComponent,
      AccountComponent,
      RequestPasswordComponent,
      ChangePasswordComponent,
      AddMatchComponent,
      PlayerDetailsComponent,
      LastGamesComponent,
      OnlineComponent,
      ChangeEmailComponent
    ],
    imports: [
      BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      HttpClientModule,
      FormsModule,
      MatCheckboxModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      BrowserAnimationsModule,
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      RouterModule.forRoot([
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'fetch-data', component: FetchDataComponent },
        { path: 'login', component: LoginComponent },
        { path: 'account', component: AccountComponent },
        { path: 'requestpassword', component: RequestPasswordComponent },
        { path: 'changepassword', component: ChangePasswordComponent },
        { path: 'change-email', component: ChangeEmailComponent },
        { path: 'add-match', component: AddMatchComponent },
        { path: 'player-details/:email', component: PlayerDetailsComponent },
        { path: 'last-games', component: LastGamesComponent }
      ])
    ],
    providers: [
      AlertService,
      AuthenticationService,
      PlayerService,
      HeadersService,
      MatchService,
      { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }],
    bootstrap: [AppComponent]
  })
export class AppModule {
}
