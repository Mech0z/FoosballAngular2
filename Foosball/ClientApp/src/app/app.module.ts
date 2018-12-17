import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';

import { AlertService, AuthenticationService, PlayerService, HeadersService } from './services/index';
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
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountComponent },
      { path: 'requestpassword', component: RequestPasswordComponent },
      { path: 'changepassword', component: ChangePasswordComponent }
    ])
  ],
  providers: [
    AlertService,
    AuthenticationService,
    PlayerService,
    HeadersService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
