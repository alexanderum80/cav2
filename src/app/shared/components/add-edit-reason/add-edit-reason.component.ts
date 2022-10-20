import { AddEditReasonService } from './../../services/add-edit-reason.service';
import { FormGroupService } from '../../services/form-group.service';
import { OdooService } from '../../services/odoo.service';
import { CallCenterService } from 'src/app/shared/services/call-center.service';
import { ModalService } from '../../services/modal.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import SweetAlert from 'sweetalert2';

@Component({
  selector: 'app-add-edit-reason',
  templateUrl: './add-edit-reason.component.html',
  styleUrls: ['./add-edit-reason.component.scss']
})
export class AddEditReasonComponent implements OnInit {
  fg!: FormGroup;

  constructor(
    private _addEditReasonSvc: AddEditReasonService,
    private _odooSvc: OdooService,
    private _callCenterSvc: CallCenterService,
    private _modalSvc: ModalService,
    private _formGroupSvc: FormGroupService
  ) { }

  ngOnInit(): void {
    this.fg = this._addEditReasonSvc.fg;
  }

  get actionName(): string {
    return this.fg.get('id')?.value === 0 ? 'Create' : 'Update';
  }

  save() {
    const id = this.fg.get('id')?.value;

    const args = {
      name: this.fg.get('name')?.value,
    };

    if (id === 0) {
      this._odooSvc.createMethod('crm.purchase.lead.reason', args).then(res => {
        if (res.error) {
          console.log(res.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: res.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        } else {
          this._modalSvc.closeModal();
          this._formGroupSvc.fg.controls[this._addEditReasonSvc.fgControl].setValue(res.result);
          this._callCenterSvc.loadReason();
        }
      });
    } else {
      this._odooSvc.writeMethod('crm.purchase.lead.reason', id, args).then(res => {
        if (res.error) {
          console.log(res.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: res.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        } else {
          this._modalSvc.closeModal();
          this._callCenterSvc.loadReason();
        }
      });
    }
  }

}
