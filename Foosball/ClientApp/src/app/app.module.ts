import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';

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

import { AlertService, AuthenticationService, PlayerService, HeadersService, MatchService } from './services/index';
import { RequestPasswordComponent } from './requestpassword/requestpassword.component';
import { ApiInterceptor } from './services/ApiInterceptor';

@NgModule({
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
    PlayerDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountComponent },
      { path: 'requestpassword', component: RequestPasswordComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'add-match', component: AddMatchComponent },
      { path: 'player-details/:email', component: PlayerDetailsComponent}
    ])
  ],
  providers: [
    AlertService,
    AuthenticationService,
    PlayerService,
    HeadersService,
    MatchService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
