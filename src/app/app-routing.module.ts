import { CallsComponent } from './components/calls/calls.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { InterfaceDefComponent } from './components/interface-def/interface-def.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CallsComponent, canActivate: [AuthGuard] },
  { path: 'call', component: InterfaceDefComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
