import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import SweetAlert from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fg!: FormGroup;
  loading = false;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.fg = new FormGroup({
      user: new FormControl(''),
      password: new FormControl(''),
    });
  }

  async login() {
    try {
      this.loading = true;

      const userName = this.fg.controls['user'].value;
      const password = this.fg.controls['password'].value;

      const res = await this._authService.login(userName, password);

      if (res) {
        this._router.navigateByUrl('/');
      } else {
        throw new Error('Invalid username or password.');
      }

      this.loading = false;
    } catch (err) {
      this.loading = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
    }
  }

  isFormValid() {
    return this.fg.controls['user'].value !== '' && this.fg.controls['password'].value !== '';
  }


}
