import SweetAlert from 'sweetalert2';
import { FormGroupService } from './../../services/form-group.service';
import { ModalService } from './../../services/modal.service';
import { CallCenterService } from './../../services/call-center.service';
import { OdooService } from './../../services/odoo.service';
import { AddEditAgentService } from './../../services/add-edit-agent.service';
import { ISelectableList } from './../../models/interface-def.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-agent',
  templateUrl: './add-edit-agent.component.html',
  styleUrls: ['./add-edit-agent.component.scss']
})
export class AddEditAgentComponent implements OnInit {
  fg!: FormGroup;

  languageValues: ISelectableList[] = [];

  constructor(
    private _addEditAgentSvc: AddEditAgentService,
    private _odooSvc: OdooService,
    private _callCenterSvc: CallCenterService,
    private _modalSvc: ModalService,
    private _formGroupSvc: FormGroupService
  ) { }

  ngOnInit(): void {
    this.fg = this._addEditAgentSvc.fg;

    this._loadLaguage();
  }

  private _loadLaguage() {
    this._odooSvc.searchValues('res.lang').then(res => {
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
        const language = res.result.records;
        this.languageValues = language.map((c: any) => {
          return {
            value: c.code,
            description: c.name
          };
        });
      }
    });
  }

  get actionName() {
    return this.fg.get('id')?.value === 0 ? 'Create' : 'Update';
  }

  save() {
    const id = this.fg.get('id')?.value;

    const args = {
      name: this.fg.get('name')?.value,
      login: this.fg.get('login')?.value,
      display_name: this.fg.get('name')?.value,
      lang: this.fg.get('language')?.value,
      email: this.fg.get('email')?.value,
      active: this.fg.get('active')?.value,
    };

    if (id === 0) {
      this._odooSvc.createMethod('res.users', args).then(res => {
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
          this._formGroupSvc.fg.controls['secondAgent'].setValue(res.result);
          this._callCenterSvc.loadAgents();
        }
      });
    } else {
      this._odooSvc.writeMethod('res.users', id, args).then(res => {
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
          this._callCenterSvc.loadAgents();
        }
      });
    }
  }

}
