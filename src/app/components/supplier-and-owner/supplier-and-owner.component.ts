import { AddEditSupplierComponent } from './../../shared/components/add-edit-supplier/add-edit-supplier.component';
import { AddEditSupplierService } from './../../shared/services/add-edit-supplier.service';
import { Subscription } from 'rxjs';
import { ShowMoreComponent } from './../../shared/components/show-more/show-more.component';
import { ModalService } from '../../shared/services/modal.service';
import { ShowMoreService } from '../../shared/services/show-more.service';
import SweetAlert from 'sweetalert2';
import { OdooService } from '../../shared/services/odoo.service';
import { DEFAULT_RECORD_LIMIT } from '../../shared/models/odoo.model';
import { FormGroupService } from '../../shared/services/form-group.service';
import { FormGroup } from '@angular/forms';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CallCenterService } from 'src/app/shared/services/call-center.service';

@Component({
  selector: 'app-supplier-and-owner',
  templateUrl: './supplier-and-owner.component.html',
  styleUrls: ['./supplier-and-owner.component.scss']
})
export class SupplierAndOwnerComponent implements OnInit, OnDestroy {
  fg!: FormGroup;

  labelPosition: 'before' | 'after' = 'before';

  supplierValues: ISelectableList[] = [];
  contactValues: ISelectableList[] = [];
  fiscalPositionValues: ISelectableList[] = [];
  supplierCityValues: ISelectableList[] = [];
  supplierProvinceValues: ISelectableList[] = [];
  supplierCountryValues: ISelectableList[] = [];
  ownerCityValues: ISelectableList[] = [];
  ownerProvinceValues: ISelectableList[] = [];
  ownerCountryValues: ISelectableList[] = [];
  donorCityValues: ISelectableList[] = [];
  donorProvinceValues: ISelectableList[] = [];
  donorCountryValues: ISelectableList[] = [];
  languageValues: ISelectableList[] = [];
  donorLanguageValues: ISelectableList[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService,
    private _odooSvc: OdooService,
    private _showMoreSvc: ShowMoreService,
    private _modalSvc: ModalService,
    private _addEditSupplierSvc: AddEditSupplierService
  ) {
    _callCenterService.suppliers$.subscribe(supplier => {
      if (supplier) {
        this.supplierValues = supplier.map(o => {
          return {
            value: o.id,
            description: o.display_name
          };
        });
        if (this.supplierValues.length === DEFAULT_RECORD_LIMIT) {
          this.supplierValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
        this.supplierValues.push({
          value: -1,
          description: 'Create...'
        });
      }
    });

    _callCenterService.contact$.subscribe(contact => {
      if (contact) {
        this.contactValues = contact.map(o => {
          return {
            value: o.id,
            description: o.display_name
          };
        });
        if (this.contactValues.length === DEFAULT_RECORD_LIMIT) {
          this.contactValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.fiscalPosition$.subscribe(fiscal => {
      if (fiscal) {
        this.fiscalPositionValues = fiscal.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.fiscalPositionValues.length === DEFAULT_RECORD_LIMIT) {
          this.fiscalPositionValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.supplierCity$.subscribe(cities => {
      if (cities) {
        this.supplierCityValues = cities.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.supplierCityValues.length === DEFAULT_RECORD_LIMIT) {
          this.supplierCityValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.supplierProvince$.subscribe(province => {
      if (province) {
        this.supplierProvinceValues = province.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.supplierProvinceValues.length === DEFAULT_RECORD_LIMIT) {
          this.supplierProvinceValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.supplierCountry$.subscribe(country => {
      if (country) {
        this.supplierCountryValues = country.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.supplierCountryValues.length === DEFAULT_RECORD_LIMIT) {
          this.supplierCountryValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.ownerCity$.subscribe(cities => {
      if (cities) {
        this.ownerCityValues = cities.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.ownerCityValues.length === DEFAULT_RECORD_LIMIT) {
          this.ownerCityValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.ownerProvince$.subscribe(province => {
      if (province) {
        this.ownerProvinceValues = province.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.ownerProvinceValues.length === DEFAULT_RECORD_LIMIT) {
          this.ownerProvinceValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.ownerCountry$.subscribe(country => {
      if (country) {
        this.ownerCountryValues = country.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.ownerCountryValues.length === DEFAULT_RECORD_LIMIT) {
          this.ownerCountryValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.donorCity$.subscribe(cities => {
      if (cities) {
        this.donorCityValues = cities.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.donorCityValues.length === DEFAULT_RECORD_LIMIT) {
          this.donorCityValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.donorProvince$.subscribe(province => {
      if (province) {
        this.donorProvinceValues = province.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.donorProvinceValues.length === DEFAULT_RECORD_LIMIT) {
          this.donorProvinceValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.donorCountry$.subscribe(country => {
      if (country) {
        this.donorCountryValues = country.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
        if (this.donorCountryValues.length === DEFAULT_RECORD_LIMIT) {
          this.donorCountryValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.language$.subscribe(lang => {
      if (lang) {
        this.languageValues = lang.map(o => {
          return {
            value: o.code,
            description: o.name
          };
        });
        if (this.languageValues.length === DEFAULT_RECORD_LIMIT) {
          this.languageValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });

    _callCenterService.donorLanguage$.subscribe(lang => {
      if (lang) {
        this.donorLanguageValues = lang.map(o => {
          return {
            value: o.code,
            description: o.name
          };
        });
        if (this.donorLanguageValues.length === DEFAULT_RECORD_LIMIT) {
          this.donorLanguageValues.push({
            value: 0,
            description: 'Find more...'
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.fg = this._formGroupService.fg;

    this._subscribeToFgChange();
  }

  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _subscribeToFgChange() {
    this.subscription.push(this.fg.controls['supplier'].valueChanges.subscribe(value => {

      switch (value) {
        case -1:
          this.fg.controls['supplier'].setValue(this.fg.value.supplier, { emitEvent: false });
          this._addEditSupplierSvc.resetFg();
          this._modalSvc.openModal(AddEditSupplierComponent);
          break;
        case 0:
          this.fg.controls['supplier'].setValue('');
          this._odooSvc.searchValues('res.partner', [], [], 0).then(res => {
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
              this._showMoreSvc.fgField = 'supplier';
              this._showMoreSvc.columns = [
                { name: 'Code', field: 'code' },
                { name: 'Name', field: 'name' },
              ];
              this._showMoreSvc.data = res.result.records;
              this._modalSvc.openModal(ShowMoreComponent);
            }
          });
          break;
        default:
          const supplier = this._callCenterService.suppliers.find(f => f.id === value);
          if (supplier) {
            const inputValue = {
              preferredLanguage: supplier.lang,
              supplierAddress: supplier.street === false ? '' : supplier.street,
              supplierCity: supplier.jiti_city[0],
              supplierPostalCode: supplier.zip,
              supplierPhone: supplier.phone,
              supplierCellulaire: supplier.mobile
            };

            this.fg.patchValue(inputValue);
          }
          break;
      }
    }));

    this.subscription.push(this.fg.controls['preferredLanguage'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['preferredLanguage'].setValue('');
        this._odooSvc.searchValues('res.lang', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'preferredLanguage';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['fiscalPosition'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['fiscalPosition'].setValue('');
        this._odooSvc.searchValues('account.fiscal.position', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'fiscalPosition';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['contactSource'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['contactSource'].setValue('');
        this._odooSvc.searchValues('crm.contact.source', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'contactSource';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['supplierCity'].valueChanges.subscribe(value => {
      const city = this._callCenterService.ownerCity.find(f => f.id === value);

      if (city) {
        const inputValue = {
          supplierProvince: city.state[0],
          supplierCountry: city.country[0]
        };

        this.fg.patchValue(inputValue);
      }

      if (value === 0) {
        this.fg.controls['supplierCity'].setValue('');
        this._odooSvc.searchValues('jiti.city', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'supplierCity';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['supplierProvince'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['supplierProvince'].setValue('');
        this._odooSvc.searchValues('res.country.state', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'supplierProvince';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['supplierCountry'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['supplierCountry'].setValue('');
        this._odooSvc.searchValues('res.country', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'supplierCountry';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['ownerCity'].valueChanges.subscribe(value => {
      const city = this._callCenterService.ownerCity.find(f => f.id === value);

      if (city) {
        const inputValue = {
          ownerProvince: city.state[0],
          ownerCountry: city.country[0]
        };

        this.fg.patchValue(inputValue);
      }

      if (value === 0) {
        this.fg.controls['ownerCity'].setValue('');
        this._odooSvc.searchValues('jiti.city', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'ownerCity';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['ownerProvince'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['ownerProvince'].setValue('');
        this._odooSvc.searchValues('res.country.state', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'ownerProvince';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['ownerCountry'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['ownerCountry'].setValue('');
        this._odooSvc.searchValues('res.country', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'ownerCountry';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['donorCity'].valueChanges.subscribe(value => {
      const city = this._callCenterService.ownerCity.find(f => f.id === value);

      if (city) {
        const inputValue = {
          donorProvince: city.state[0],
          donorCountry: city.country[0]
        };

        this.fg.patchValue(inputValue);
      }

      if (value === 0) {
        this.fg.controls['donorCity'].setValue('');
        this._odooSvc.searchValues('jiti.city', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'donorCity';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['donorProvince'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['donorProvince'].setValue('');
        this._odooSvc.searchValues('res.country.state', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'donorProvince';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));

    this.subscription.push(this.fg.controls['donorCountry'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['donorCountry'].setValue('');
        this._odooSvc.searchValues('res.country', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'donorCountry';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      }
    }));
  }

  filterSupplier(value: string) {
    this._callCenterService.loadSuppliers(value);
  }

  filterLanguage(value: string) {
    this._callCenterService.loadLanguage(value);
  }

  filterFiscalPosition(value: string) {
    this._callCenterService.loadFiscalPosition(value);
  }

  filterContact(value: string) {
    this._callCenterService.loadContact(value);
  }

  filterSupplierCity(value: string) {
    this._callCenterService.loadSupplierCity(value);
  }

  filterSupplierProvince(value: string) {
    this._callCenterService.loadSupplierProvince(value);
  }

  filterSupplierCountry(value: string) {
    this._callCenterService.loadSupplierCountry(value);
  }

  filterOwnerCity(value: string) {
    this._callCenterService.loadOwnerCity(value);
  }

  filterOwnerProvince(value: string) {
    this._callCenterService.loadOwnerProvince(value);
  }

  filterOwnerCountry(value: string) {
    this._callCenterService.loadOwnerCountry(value);
  }

  filterDonorCity(value: string) {
    this._callCenterService.loadDonorCity(value);
  }

  filterDonorProvince(value: string) {
    this._callCenterService.loadDonorProvince(value);
  }

  filterDonorCountry(value: string) {
    this._callCenterService.loadDonorCountry(value);
  }

  filterDonorLanguage(value: string) {
    this._callCenterService.loadDonorLanguage(value);
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get supplierIsOwner(): boolean {
    return this.fg.controls['isSupplierOwner'].value === true;
  }

  get supplierTabValid() {
    return this._callCenterService.supplierTabValid;
  }

  get ownerIsDonor() {
    return this.fg.controls['isOwnerDonor'].value === true;
  }

  goNextTab() {
    this._callCenterService.goNextTab();
  }

  get isCharity() {
    return this._callCenterService.charityAction;
  }

  get isDropOff() {
    return this._callCenterService.isDropOff;
  }

  editSupplier(idSupplier: number | string) {
    const domain = [['supplier', '=', 1], ['id', '=', idSupplier]];
    this._odooSvc.searchValues('res.partner', domain).then(res => {
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
        const supplier = res.result.records[0];
        console.log(supplier);
        const payload = {
          id: supplier.id,
          name: supplier.name,
          purchaseCategory: supplier.purchase_category[0] || '',
          street: supplier.street,
          city: supplier.jiti_city[0] || '',
          state: supplier.state_id[0] || '',
          zip: supplier.zip,
          country: supplier.country_id[0] || '',
          website: supplier.website,
          function: supplier.function,
          phone: supplier.phone,
          mobile: supplier.mobile,
          fax: supplier.fax,
          email: supplier.email,
          title: supplier.title[0] || '',
        };

        this._addEditSupplierSvc.fg.patchValue(payload);
        this._modalSvc.openModal(AddEditSupplierComponent);
      }
    });
  }

}
