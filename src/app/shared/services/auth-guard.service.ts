import { Injectable, Injector } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

export interface RouteAccess {
    id: number;
    shouldActivate: boolean;
    state: any;
    url: string;
    urlAfterRedirects: any;
}

@Injectable()
export class AuthGuard implements CanActivate {

    hasAccess = true;

    constructor(
        private _router: Router,
        private _authenticationSvc: AuthenticationService,
        private _usuarioService: UserService,
        private _injector: Injector,
    ) {}

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
        if (!this._authenticationSvc.authenticated || !this._usuarioService.user) {
            if (routerStateSnapshot.url === '/') {
                this._router.navigate(['/login']);
            } else {
                this._router.navigate(['/login'], { queryParams: { continue: routerStateSnapshot.url }});
            }
            return false;
        }

        return true;
    }

}
