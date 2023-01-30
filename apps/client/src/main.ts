import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter,withEnabledBlockingInitialNavigation } from '@angular/router';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environments';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestInterceptor, provideCore } from '@client/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

if(environment.production){
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideCore({
    "API_URL": environment.apiURL,
    "WS_URL": environment.wsURL
    }),
    importProvidersFrom(BrowserAnimationsModule,MatSnackBarModule,HttpClientModule)
  ],
}).catch((err) => console.error(err));

