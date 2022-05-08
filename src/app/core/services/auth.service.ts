import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, skip, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicCredentials, RegisterInfo } from '../types/auth.type';

import {
    Auth,
    User,
    UserCredential,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInAnonymously,
    createUserWithEmailAndPassword,
    signOut
} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public isAuth$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    // Emits true when auth services finish loading
    public isCompleted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private accessToken?: string;

    constructor(
        private auth: Auth,
        private http: HttpClient
    ) {
        // User is anonymous is equal to no authenticated
        this.loginAnonymously();

        onAuthStateChanged(auth, (user: any) => {
            if (!!user) {
                if (user?.isAnonymous) {
                    this.authServiceConsoleLog('onAuthStateChanged (anonymous)', user);
                    this.accessToken = user?.accessToken;
                    this.isAuth$.next(null);
                    this.isCompleted$.next(true);
                } else {
                    // Email and password or Google authentication
                    this.authServiceConsoleLog('onAuthStateChanged', user);
                    this.accessToken = user?.accessToken;
                    this.isAuth$.next(user);
                    this.isCompleted$.next(true);
                }
            }
        });
    }

    public loginAnonymously(): Observable<UserCredential> {
        return from(signInAnonymously(this.auth))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginWithEmailAndPassword', resp);
                })
            );
    }

    public loginWithEmailAndPassword(credentials: BasicCredentials): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginWithEmailAndPassword', resp);
                })
            );
    }

    public loginWithGoogle(): Observable<UserCredential> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider()))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginWithGoogle', resp);
                }),
                switchMap((resp: any) => {
                    const data = resp._tokenResponse;
                    // If is new user then save data in planishare database
                    if (data.isNewUser) {
                        const registerInfo: RegisterInfo = {
                            email: data.email,
                            first_name: data.firstName,
                            last_name: data.lastName
                        };
                        return this.register(registerInfo);
                    }
                    return of(resp);
                })
            );
    }

    public logout(): void {
        this.authServiceConsoleLog('Logout!');
        from(signOut(this.auth)).subscribe(() => {
            this.loginAnonymously();
        });
    }

    // Register in firebase
    public registerWithEmailAndPassword(credentials: BasicCredentials): Observable<UserCredential> {
        return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('registerWithEmailAndPassword', resp);
                }),
                switchMap(resp => {
                    return this.register(credentials);
                })
            );
    }

    // Register in planishare database
    public register(credentials: BasicCredentials | RegisterInfo): Observable<any> {
        return this.http.post(environment.API_URL + '/auth/register/', credentials)
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('register', resp);
                })
            );
    }

    public getAccessToken(): string | undefined {
        return this.accessToken;
    }

    private authServiceConsoleLog(...data: any[]): void {
        console.log(
            `%c (AUTH-SERVICE): ${data[0]}`,
            'background: #222; color: #bada55',
            ...data.splice(1,1)
        );
    }
}