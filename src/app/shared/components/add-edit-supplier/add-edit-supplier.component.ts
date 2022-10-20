import { FormGroupService } from './../../services/form-group.service';
import { ModalService } from './../../services/modal.service';
import { CallCenterService } from './../../services/call-center.service';
import { OdooService } from './../../services/odoo.service';
import { AddEditSupplierService } from './../../services/add-edit-supplier.service';
import { ISelectableList } from './../../models/interface-def.model';
import { FormGroup } from '@angular/forms';
import SweetAlert from 'sweetalert2';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-supplier',
  templateUrl: './add-edit-supplier.component.html',
  styleUrls: ['./add-edit-supplier.component.scss']
})
export class AddEditSupplierComponent implements OnInit {
  fg!: FormGroup;

  purchaseCategoryValues: ISelectableList[] = [];
  cityValues: ISelectableList[] = [];
  provinceValues: ISelectableList[] = [];
  countryValues: ISelectableList[] = [];
  titleValues: ISelectableList[] = [];

  constructor(
    private _editSupplierSvc: AddEditSupplierService,
    private _odooSvc: OdooService,
    private _callCenterSvc: CallCenterService,
    private _modalSvc: ModalService,
    private _formGroupSvc: FormGroupService
  ) { }

  ngOnInit(): void {
    this.fg = this._editSupplierSvc.fg;

    this._loadPurchaseCategory();
    this._loadCity();
    this._loadProvince();
    this._loadCountry();
    this._loadTitle();
  }

  private _loadPurchaseCategory() {
    this._odooSvc.searchValues('jiti.purchase.category').then(res => {
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
        const purchase = res.result.records;
        this.purchaseCategoryValues = purchase.map((c: any) => {
          return {
            value: c.id,
            description: c.name
          };
        });
      }
    });
  }

  private _loadCity() {
    this._odooSvc.searchValues('jiti.city').then(res => {
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
        const city = res.result.records;
        this.cityValues = city.map((c: any) => {
          return {
            value: c.id,
            description: c.name
          };
        });
      }
    });
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

  private _loadTitle() {
    this._odooSvc.searchValues('res.partner.title').then(res => {
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
        const title = res.result.records;
        this.titleValues = title.map((c: any) => {
          return {
            value: c.id,
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
      display_name: this.fg.get('name')?.value,
      purchase_category: this.fg.get('purchaseCategory')?.value,
      street: this.fg.get('street')?.value,
      street2: this.fg.get('street2')?.value,
      jiti_city: this.fg.get('city')?.value,
      state: this.fg.get('state')?.value,
      zip: this.fg.get('zip')?.value,
      country_id: this.fg.get('country')?.value,
      website: this.fg.get('website')?.value,
      function: this.fg.get('function')?.value,
      phone: this.fg.get('phone')?.value,
      mobile: this.fg.get('mobile')?.value,
      fax: this.fg.get('fax')?.value,
      email: this.fg.get('email')?.value,
      title: this.fg.get('title')?.value,
      supplier: true,
      is_company: false,
      customer: false,
      employee: false,
      active: this.fg.get('active')?.value,
    };

    if (id === 0) {
      this._odooSvc.createMethod('res.partner', args).then(res => {
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
          this._formGroupSvc.fg.controls['supplier'].setValue(res.result);
          this._callCenterSvc.loadSuppliers();
        }
      });
    } else {
      this._odooSvc.writeMethod('res.partner', id, args).then(res => {
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
          this._callCenterSvc.loadSuppliers();
        }
      });
    }
  }

}
