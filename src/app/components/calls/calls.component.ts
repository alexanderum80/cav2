import { FormGroupService } from '../../shared/services/form-group.service';
import SweetAlert from 'sweetalert2';
import { NewCallComponent } from './../new-call/new-call.component';
import { ModalService } from '../../shared/services/modal.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { OdooService } from '../../shared/services/odoo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  displayedColumns = ['date', 'action_id', 'company_id', 'partner_id', 'user_id', 'state'];
  dataSource: any[] = [];

  logged = true;

  constructor(
    private _odooService: OdooService,
    private _sessionStorageService: SessionStorageService,
    private _router: Router,
    private _userService: UserService,
    private _modalService: ModalService,
    private _formGroupService: FormGroupService
  ) { }

  ngOnInit(): void {
    this._loadPhonesCall();
  }

  private async _loadPhonesCall() {
    this._odooService.searchValues('crm.phonecall', [], [], 20).then(resp => {
      if (resp.error) {
        console.log(resp.error.data);
        SweetAlert.fire({
          icon: 'error',
          title: 'Error',
          text: resp.error.data.message,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      } else {
        this.dataSource = resp.result.records;
      }
    });
  }

  get userName(): string {
    return this._userService.user.username;
  }

  logout() {
    this._formGroupService.resetFormGroup();
    this._sessionStorageService.removeSession('token');
    this._router.navigateByUrl('login');
  }

  openNewCall() {
    this._formGroupService.resetFormGroup();
    this._modalService.openModal(NewCallComponent);
  }

}
