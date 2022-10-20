import { SessionStorageService } from './session-storage.service';
import { environment } from '../../../environments/environment';
import { Session } from '../models/session';
import { auth_url } from '../models/odoo.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
    private _authenticatedSubject = new BehaviorSubject <boolean> (false);

    constructor(
        private _router: Router,
        private _usuarioSvc: UserService,
        private httpClient: HttpClient,
        private _sessionStorageSrv: SessionStorageService
    ) {}

    get authenticated(): boolean {
        return this._authenticatedSubject.getValue();
    }

    async login(userName: string, password: string): Promise<boolean> {
        try {
            const headers: HttpHeaders = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            const params = {
                jsonrpc: '2.0',
                params: {
                    context: {},
                    db: environment.dataBase,   // nombre de la BD de Odoo
                    login: userName, // usuario
                    password: password // contraseña
                }
            };
            const res = await this.httpClient.post<any>(auth_url, params, { headers }).toPromise();

            if (res.result.uid !== false) {
                const session: Session = res.result;

                this._sessionStorageSrv.createSession('token', session);

                this.authenticate(true, session);
            }

            return this.authenticated;
        } catch (err) {
            return false;
        }
    }

    logout(): void {
        this.authenticate(false);
        this._sessionStorageSrv.removeSession('token');

        this._router.navigate(['login']);
    }

    get authenticated$(): Observable < boolean > {
        return this._authenticatedSubject.asObservable();
    }

    async authenticate(authenticate: boolean, session?: any) {
        if (authenticate) {
            this._usuarioSvc.updateUserInfo(session);
        } else {
            this._usuarioSvc.removeUser();
            this._usuarioSvc.unsubscribe();
        }

        this._authenticatedSubject.next(authenticate);
    }

}
