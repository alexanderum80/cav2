import SweetAlert from 'sweetalert2';
import { ISelectableList } from './../../models/interface-def.model';
import { CallCenterService } from './../../services/call-center.service';
import { FormGroup } from '@angular/forms';
import { ModalService } from './../../services/modal.service';
import { OdooService } from './../../services/odoo.service';
import { EditCompanyService } from './../../services/edit-company.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {
  fg!: FormGroup;

  provinceValues: ISelectableList[] = [];
  countryValues: ISelectableList[] = [];

  constructor(
    private _editCompanySvc: EditCompanyService,
    private _odooSvc: OdooService,
    private _callCenterSvc: CallCenterService,
    private _modalSvc: ModalService,
  ) { }

  ngOnInit(): void {
    this.fg = this._editCompanySvc.fg;

    this._loadProvince();
    this._loadCountry();
  }

  private _loadProvince() {
    this._odooSvc.searchValues('res.country.state').then(res => {
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
        const province = res.result.records;
        this.provinceValues = province.map((c: any) => {
          return {
            value: c.id,
            description: c.name
          };
        });
      }
    });
  }

  private _loadCountry() {
    this._odooSvc.searchValues('res.country').then(res => {
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
        const country = res.result.records;
        this.countryValues = country.map((c: any) => {
          return {
            value: c.id,
            description: c.name
          };
        });
      }
    });
  }

  save() {
    const id = this.fg.get('id')?.value;

    const args = {
      code: this.fg.get('code')?.value,
      name: this.fg.get('name')?.value,
      display_name: this.fg.get('name')?.value,
      street: this.fg.get('street')?.value,
      street2: this.fg.get('street2')?.value,
      city: this.fg.get('city')?.value,
      state: this.fg.get('state')?.value,
      zip: this.fg.get('zip')?.value,
      country: this.fg.get('country')?.value,
      rml_header1: this.fg.get('rmlHeader1')?.value,
      website: this.fg.get('website')?.value,
      phone: this.fg.get('phone')?.value,
      fax: this.fg.get('fax')?.value,
      email: this.fg.get('email')?.value,
      vat: this.fg.get('vat')?.value,
      company_registry: this.fg.get('companyRegistry')?.value,
    };

    this._odooSvc.writeMethod('res.company', id, args).then(res => {
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
        this._callCenterSvc.loadCompany();
      }
    });
  }

}
