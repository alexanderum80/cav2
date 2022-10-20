import { Session } from '../models/session';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable()
export class UserService {
    private _allowAction: boolean;

    private _userSubject = new BehaviorSubject<any>(null);

    private _subscription: Subscription[] = [];

    constructor() {
        this._allowAction = false;
    }

    get user(): Session {
        return this._userSubject.value;
    }

    get user$(): Observable<any> {
        return this._userSubject.asObservable();
    }

    get subscription(): Subscription[] {
        return this._subscription;
    }

    unsubscribe(): void {
        this._subscription.forEach(s => {
            if (s && !s.closed && (typeof s.unsubscribe === 'function')) {
                s.unsubscribe();
            }
        });
    }

    updateUserInfo(userInfo: Session): void {
        if (!userInfo) {
            return this._userSubject.next(null);
        }

        const that = this;

        that._setUser(userInfo);
    }

    removeUser() {
        this._userSubject.next(null);
    }

    hasAdminPermission(): boolean {
        const currentUser = this._userSubject.value;

        if (!currentUser) { return false; }

        this._allowAction = currentUser.TipoUsuario === 1 ? true : false;

        return this._allowAction;
    }

    private _setUser(user: Session): void {
        if (!user) { return; }
        this._userSubject.next(user);
    }

}
