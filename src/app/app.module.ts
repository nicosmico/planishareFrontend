import {
    Injectable,
    Injector,
    InjectionToken,
    NgModule,
    ErrorHandler,
    Inject
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Modules
import { CoreModule } from './core/core.module';
import { HomepageModule } from './features/homepage/homepage.module';
import { SharedModule } from './shared/shared.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// Firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import * as Rollbar from 'rollbar';
import { RollbarErrorHandlerService } from './core/services/rollbar-error-handler.service';
import { RollbarHttpErrorInterceptor } from './core/interceptors/rollbar-http-error.interceptor';

const rollbarConfig: Rollbar.Configuration = {
    accessToken: '722c61425c0043098adab09252c3732f',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: environment.production,
    environment: environment.production ? 'prod' : 'dev'
};

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}
export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomepageModule,
        SharedModule,
        BrowserAnimationsModule,
        CoreModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage())
    ],
    providers: [
        ScreenTrackingService,
        UserTrackingService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true // Intercept all requests
        },
        { provide: ErrorHandler, useClass: RollbarErrorHandlerService },
        { provide: RollbarService, useFactory: rollbarFactory },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RollbarHttpErrorInterceptor,
            multi: true // Intercept all requests
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
