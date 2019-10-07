import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSnackBarModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatProgressSpinnerModule, MatMenuModule } from '@angular/material/';
import { MatInputModule, MatCheckboxModule, MatDialogModule, MatTabsModule, MatDatepickerModule } from '@angular/material/';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './login/login.component';
import { ActivityComponent } from './activity/activity.component';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LastGamesComponent } from './last-games/last-games.component';
import { OnlineComponent } from './online/online.component';
import { RequestPasswordComponent } from './requestpassword/requestpassword.component';
import { ApiInterceptor } from './services/ApiInterceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { AdminComponent } from './admin/admin.component';
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { PlayerService } from './services/player.service';
import { HeadersService } from './services/headers.service';
import { MatchService } from './services/match.service';
import { AdministrationService } from './services/administration.service';
import { LeaderboardService } from './services/leaderboard.service';
import { LastGamesDialogComponent } from './last-games/last-games-dialog.component';
import { ActivityService } from './services/activity.service';
import { ResponsiveOverviewComponent } from './views/responsive-overview/responsive-overview.component';

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
    PlayerDetailsComponent,
    LastGamesComponent,
    LastGamesDialogComponent,
    OnlineComponent,
    ChangeEmailComponent,
    RegisterAccountComponent,
    ResponsiveOverviewComponent,
    AdminComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTabsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot([
      { path: '', component: FetchDataComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountComponent },
      { path: 'requestpassword', component: RequestPasswordComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'change-email', component: ChangeEmailComponent },
      { path: 'add-match', component: AddMatchComponent },
      { path: 'player-details/:email', component: PlayerDetailsComponent },
      { path: 'last-games', component: LastGamesComponent },
      { path: 'register-account', component: RegisterAccountComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'activity', component: ActivityComponent }
    ])
  ],
  entryComponents: [LastGamesDialogComponent],
  providers: [
    AlertService,
    AuthenticationService,
    PlayerService,
    HeadersService,
    MatchService,
    AdministrationService,
    LeaderboardService,
    ActivityService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: 'da-DK'}],
    exports: [ LastGamesDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
