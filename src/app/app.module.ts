import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// used to create fake backend
import { appInitializer, ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent, ToastComponent } from './_components';
import { ForgotPasswordModalComponent, LoginModalComponent, RegisterModalComponent, ResetPasswordModalComponent, VerifyEmailModalComponent } from './account/_modals';
import { AccountService } from './_services';
import { HomeComponent } from './home';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ToastComponent,
    AlertComponent,
    HomeComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ForgotPasswordModalComponent,
    ResetPasswordModalComponent,
    VerifyEmailModalComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
