import { AddEditActionService } from './../../services/add-edit-action.service';
import { FormGroupService } from '../../services/form-group.service';
import { ModalService } from '../../services/modal.service';
import { CallCenterService } from '../../services/call-center.service';
import SweetAlert from 'sweetalert2';
import { OdooService } from '../../services/odoo.service';
import { ISelectableList } from '../../models/interface-def.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-action',
  templateUrl: './add-edit-action.component.html',
  styleUrls: ['./add-edit-action.component.scss']
})
export class AddEditActionComponent implements OnInit {
  fg!: FormGroup;
  programType: any[] = [];
  programTypeValues: ISelectableList[] = [];
  contactValues: ISelectableList[] = [];

  constructor(
    private _addEditActionSvc: AddEditActionService,
    private _odooSvc: OdooService,
    private _callCenterSvc: CallCenterService,
    private _modalSvc: ModalService,
    private _formGroupSvc: FormGroupService
  ) { }

  ngOnInit(): void {
    this.fg = this._addEditActionSvc.fg;

    this._loadContacts();
    this._loadProgramType();

    this._subscribeToFormChanges();
  }

  private _loadContacts() {
    this.contactValues = this._callCenterSvc.contact.map(c => {
      return {
        value: c.id,
        description: c.name
      };
    });
  }

  private _loadProgramType() {
    this._odooSvc.searchValues('charity.program.type', [], [], 0).then(res => {
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
        this.programType = res.result.records;
        this.programTypeValues = this.programType.map((data: any) => {
          return {
            value: data.id,
            description: data.charity_name
          };
        });
      }
    });
  }

  private _subscribeToFormChanges() {
    this.fg.get('programType')?.valueChanges.subscribe(value => {
      const _programType = this.programType.find(p => p.id === value);

      const _isCharity = _programType?.is_charity || false;
      this.fg.controls['isCharity'].setValue(_isCharity);
    });
  }

  get actionName(): string {
    return this.fg.get('id')?.value === 0 ? 'Create' : 'Update';
  }

  save() {
    const id = this.fg.get('id')?.value;

    const args = {
      allow_create_an_opp: this.fg.get('allowCreateOpp')?.value,
      name: this.fg.get('name')?.value,
      notes: this.fg.get('notes')?.value,
      active: this.fg.get('active')?.value,
      charity_program_type: this.fg.get('programType')?.value,
      is_kidney: this.fg.get('isKidney')?.value,
      is_charity: this.fg.get('isCharity')?.value,
    };

    if (id === 0) {
      this._odooSvc.createMethod('crm.phonecall.action', args).then(res => {
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
          this._formGroupSvc.fg.controls[this._addEditActionSvc.fgControl].setValue(res.result);
          this._callCenterSvc.loadActions();
        }
      });
    } else {
      this._odooSvc.writeMethod('crm.phonecall.action', id, args).then(res => {
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
          this._callCenterSvc.loadActions();
        }
      });
    }
  }

}
