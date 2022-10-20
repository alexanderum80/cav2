import SweetAlert from 'sweetalert2';
import { UserService } from './user.service';
import { OdooService } from './odoo.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormGroupService } from './form-group.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CallCenterService {
  fg!: FormGroup;

  private _actionsSubject = new BehaviorSubject<any[]>([]);
  private _makeSubject = new BehaviorSubject<any[]>([]);
  private _modelSubject = new BehaviorSubject<any[]>([]);
  private _supplierSubject = new BehaviorSubject<any[]>([]);
  private _contactSubject = new BehaviorSubject<any[]>([]);
  private _highCataCarSubject = new BehaviorSubject<any[]>([]);
  private _goodCarSubject = new BehaviorSubject<any[]>([]);
  private _companySubject = new BehaviorSubject<any[]>([]);
  private _curbWeightSubject = new BehaviorSubject<any[]>([]);
  private _agentSubject = new BehaviorSubject<any[]>([]);
  private _reasonSubject = new BehaviorSubject<any[]>([]);
  private _pickupTypeSubject = new BehaviorSubject<any[]>([]);
  private _fiscalPositionSubject = new BehaviorSubject<any[]>([]);
  private _supplierCitySubject = new BehaviorSubject<any[]>([]);
  private _supplierProvinceSubject = new BehaviorSubject<any[]>([]);
  private _supplierCountrySubject = new BehaviorSubject<any[]>([]);
  private _ownerCitySubject = new BehaviorSubject<any[]>([]);
  private _ownerProvinceSubject = new BehaviorSubject<any[]>([]);
  private _ownerCountrySubject = new BehaviorSubject<any[]>([]);
  private _donorCitySubject = new BehaviorSubject<any[]>([]);
  private _donorProvinceSubject = new BehaviorSubject<any[]>([]);
  private _donorCountrySubject = new BehaviorSubject<any[]>([]);
  private _towingCitySubject = new BehaviorSubject<any[]>([]);
  private _towingProvinceSubject = new BehaviorSubject<any[]>([]);
  private _towingCountrySubject = new BehaviorSubject<any[]>([]);
  private _tiresSubject = new BehaviorSubject<any[]>([]);
  private _wheelsSubject = new BehaviorSubject<any[]>([]);
  private _brakesSubject = new BehaviorSubject<any[]>([]);
  private _locationSubject = new BehaviorSubject<any[]>([]);
  private _paymentMethodSubject = new BehaviorSubject<any[]>([]);
  private _languageSubject = new BehaviorSubject<any[]>([]);
  private _donorLanguageSubject = new BehaviorSubject<any[]>([]);
  private _unitOfMeasurementSubject = new BehaviorSubject<any[]>([]);
  private _colorSubject = new BehaviorSubject<any[]>([]);
  private _styleSubject = new BehaviorSubject<any[]>([]);
  private _driveLineSubject = new BehaviorSubject<any[]>([]);
  private _engineTypeSubject = new BehaviorSubject<any[]>([]);
  private _defaultConfigurationSubject = new BehaviorSubject<any[]>([]);
  private _vehicleMissingPartSubject = new BehaviorSubject<any[]>([]);

  private _selectedTabIndex = 0;
  freeDebt = false;

  private _IMPOUND_GARAGE_DDEFAULT_VALUE = '4';

  constructor(
    private _fromGroupService: FormGroupService,
    private _odooSvc: OdooService,
    private _userSvc: UserService
  ) {
    this.fg = _fromGroupService.fg;
   }

  fillTowingAddress() {
    switch (this.fg.controls['towingAddressOption'].value) {
      // enter manually
      case 'enter_manually':
        this._clearTowingInfo();
        break;
      // same as supplier
      case 'same_as_supplier':
        this._fillTowingAddressFromSupplier();
        break;
      // same as owner
      case 'same_as_owner':
        if (this.fg.controls['isSupplierOwner'].value === true) {
          this._fillTowingAddressFromSupplier();
        } else {
          this._fillTowingAddressFromOwner();
        }
        break;
      // case 'same_as_donor':
      //   if (this.fg.controls['isOwnerDonor'].value === true) {
      //     if (this.fg.controls['isSupplierOwner'].value === true) {
      //       this._fillTowingAddressFromSupplier();
      //     } else {
      //        this._fillTowingAddressFromOwner();
      //      }
      //   } else {
      //     this._fillTowingAddressFromDonor();
      //   }
      //   break;
    }
  }

  private _clearTowingInfo() {
    const inputValue = {
      towingAddress: '',
      towingCity: '',
      towingProvince: '',
      towingPostalCode: '',
      towingCountry: '',
      towingPhone: '',
      towingCellulaire: ''
    };

    this.fg.patchValue(inputValue);
  }

  private _fillTowingAddressFromSupplier() {
    const inputValue = {
      towingAddress: this.fg.get('supplierAddress')?.value,
      towingCity: this.fg.get('supplierCity')?.value,
      towingProvince: this.fg.get('supplierProvince')?.value,
      towingPostalCode: this.fg.get('supplierPostalCode')?.value,
      towingCountry: this.fg.get('supplierCountry')?.value,
      towingPhone: this.fg.get('supplierPhone')?.value,
      towingCellulaire: this.fg.get('supplierCellulaire')?.value
    };

    this.fg.patchValue(inputValue);
  }

  private _fillTowingAddressFromOwner() {
    const inputValue = {
      towingAddress: this.fg.get('ownerAddress')?.value,
      towingCity: this.fg.get('ownerCity')?.value,
      towingProvince: this.fg.get('ownerProvince')?.value,
      towingPostalCode: this.fg.get('ownerPostalCode')?.value,
      towingCountry: this.fg.get('ownerCountry')?.value,
      towingPhone: this.fg.get('ownerPhone')?.value,
      towingCellulaire: this.fg.get('ownerCellulaire')?.value
    };

    this.fg.patchValue(inputValue);
  }

  private _fillTowingAddressFromDonor() {
    const inputValue = {
      towingAddress: this.fg.get('donorAddress')?.value,
      towingCity: this.fg.get('donorCity')?.value,
      towingProvince: this.fg.get('donorProvince')?.value,
      towingPostalCode: this.fg.get('donorPostalCode')?.value,
      towingCountry: this.fg.get('donorCountry')?.value,
      towingPhone: this.fg.get('donorPhone')?.value,
      towingCellulaire: this.fg.get('donorCellulaire')?.value
    };

    this.fg.patchValue(inputValue);
  }

  // actions
  loadActions(searhValue?: string): Promise<boolean> {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('crm.phonecall.action', domain, [], 0).then(res => {
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
          this._actionsSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get actions() {
    return this._actionsSubject.value;
  }

  get actions$(): Observable<any[]> {
    return this._actionsSubject.asObservable();
  }

  // make
  loadMake(searhValue?: string): Promise<boolean> {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('vin.brand', domain, [], 0).then(res => {
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
          this._makeSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get make() {
    return this._makeSubject.value;
  }

  get make$(): Observable<any[]> {
    return this._makeSubject.asObservable();
  }

  // model
  loadModel(make: string, searhValue?: string): Promise<boolean> {
    const domain = [['brand', '=', make]];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('vin.model', domain, [], 0).then(res => {
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
          this._modelSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get model() {
    return this._modelSubject.value;
  }

  get model$(): Observable<any[]> {
    return this._modelSubject.asObservable();
  }

  // suppliers
  loadSuppliers(searhValue?: string): Promise<boolean> {
    const domain = [['supplier', '=', 1]];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
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
          this._supplierSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get suppliers() {
    return this._supplierSubject.value;
  }

  get suppliers$(): Observable<any[]> {
    return this._supplierSubject.asObservable();
  }

  // contact
  loadContact(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.contact.source', domain).then(res => {
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
        this._contactSubject.next(res.result.records);
      }
    });
  }

  get contact() {
    return this._contactSubject.value;
  }

  get contact$(): Observable<any[]> {
    return this._contactSubject.asObservable();
  }

  // high cata car
  loadHighCataCar(searhValue?: string): Promise<boolean> {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('jiti.high.cata.car', domain).then(res => {
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
          this._highCataCarSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get highCataCar() {
    return this._highCataCarSubject.value;
  }

  get highCataCar$(): Observable<any[]> {
    return this._highCataCarSubject.asObservable();
  }

  // good car
  loadGoodCar(searhValue?: string): Promise<boolean> {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('jiti.good.car', domain).then(res => {
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
          this._goodCarSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get goodCar() {
    return this._goodCarSubject.value;
  }

  get goodCar$(): Observable<any[]> {
    return this._goodCarSubject.asObservable();
  }

  // company
  async loadCompany(searhValue?: string): Promise<boolean> {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    const companyQueryResp = await this._odooSvc.searchValues('res.company', domain);
    if (companyQueryResp.error) {
      console.log(companyQueryResp.error.data);
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: companyQueryResp.error.data.message,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
    } else {
      const companies: any[] = [];

      const response = companyQueryResp.result.records;
      for (const element of response) {
        const args = [element.id];
        const companyNameResp = await this._odooSvc.callMethod('res.company', 'name_get', args);
        if (companyNameResp.error) {
          console.log(companyNameResp.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: companyNameResp.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        } else {
          const data = companyNameResp.result[0];
          companies.push({
            id: data[0],
            name: data[1]
          });
        }
      }
      this._companySubject.next(companies);
    }
    return new Promise<boolean>((resolve) => {
      resolve(true);
    });
  }

  get company() {
    return this._companySubject.value;
  }

  get company$(): Observable<any[]> {
    return this._companySubject.asObservable();
  }

  // curb weight
  loadCurbWeight(): Promise<boolean> {
    const domain: any[] | undefined = [];

    const make = this._fromGroupService.fg.get('make')?.value || '';
    const model = this._fromGroupService.fg.get('model')?.value || '';

    domain.push(['brand', '=', make]);
    domain.push(['model', '=', model]);

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('vin.curb.weight', domain).then(res => {
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
          this._curbWeightSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get curbWeight() {
    return this._curbWeightSubject.value;
  }

  get curbWeight$(): Observable<any[]> {
    return this._curbWeightSubject.asObservable();
  }

  // agents
  loadAgents(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.users', domain).then(res => {
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
        this._agentSubject.next(res.result.records);
      }
    });
  }

  get agent() {
    return this._agentSubject.value;
  }

  get agent$(): Observable<any[]> {
    return this._agentSubject.asObservable();
  }

  // reason
  loadReason(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.purchase.lead.reason', domain, [], 0).then(res => {
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
        this._reasonSubject.next(res.result.records);
      }
    });
  }

  get reason() {
    return this._reasonSubject.value;
  }

  get reason$(): Observable<any[]> {
    return this._reasonSubject.asObservable();
  }

    // payment method
  loadPaymentMethod(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.payment.method', domain, [], 0).then(res => {
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
        this._paymentMethodSubject.next(res.result.records);
      }
    });
  }

  get paymentMethod() {
    return this._paymentMethodSubject.value;
  }

  get paymentMethod$(): Observable<any[]> {
    return this._paymentMethodSubject.asObservable();
  }

  // pickup type
  loadPickupType(searhValue?: string): void {
    const domain = [['company_id', '=', this.fg.get('company')?.value]];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.pickup.type', domain, [], 0).then(res => {
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
        this._pickupTypeSubject.next(res.result.records);
      }
    });
  }

  get pickupType() {
    return this._pickupTypeSubject.value;
  }

  get pickupType$(): Observable<any[]> {
    return this._pickupTypeSubject.asObservable();
  }

  // fiscal position
  loadFiscalPosition(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }
    domain.push(['company_id', '=', this.fg.get('company')?.value]);

    this._odooSvc.searchValues('account.fiscal.position', domain).then(res => {
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
        this._fiscalPositionSubject.next(res.result.records);
      }
    });
  }

  get fiscalPosition() {
    return this._fiscalPositionSubject.value;
  }

  get fiscalPosition$(): Observable<any[]> {
    return this._fiscalPositionSubject.asObservable();
  }

    // supplier city
  loadSupplierCity(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('jiti.city', domain).then(res => {
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
        this._supplierCitySubject.next(res.result.records);
      }
    });
  }

  get supplierCity() {
    return this._supplierCitySubject.value;
  }

  get supplierCity$(): Observable<any[]> {
    return this._supplierCitySubject.asObservable();
  }

  // supplier province
  loadSupplierProvince(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country.state', domain).then(res => {
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
        this._supplierProvinceSubject.next(res.result.records);
      }
    });
  }

  get supplierProvince() {
    return this._supplierProvinceSubject.value;
  }

  get supplierProvince$(): Observable<any[]> {
    return this._supplierProvinceSubject.asObservable();
  }

  // supplier country
  loadSupplierCountry(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country', domain).then(res => {
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
        this._supplierCountrySubject.next(res.result.records);
      }
    });
  }

  get supplierCountry() {
    return this._supplierCountrySubject.value;
  }

  get supplierCountry$(): Observable<any[]> {
    return this._supplierCountrySubject.asObservable();
  }

  // owner city
  loadOwnerCity(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('jiti.city', domain).then(res => {
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
        this._ownerCitySubject.next(res.result.records);
      }
    });
  }

  get ownerCity() {
    return this._ownerCitySubject.value;
  }

  get ownerCity$(): Observable<any[]> {
    return this._ownerCitySubject.asObservable();
  }

  // owner province
  loadOwnerProvince(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country.state', domain).then(res => {
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
        this._ownerProvinceSubject.next(res.result.records);
      }
    });
  }

  get ownerProvince() {
    return this._ownerProvinceSubject.value;
  }

  get ownerProvince$(): Observable<any[]> {
    return this._ownerProvinceSubject.asObservable();
  }

  // owner country
  loadOwnerCountry(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country', domain).then(res => {
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
        this._ownerCountrySubject.next(res.result.records);
      }
    });
  }

  get ownerCountry() {
    return this._ownerCountrySubject.value;
  }

  get ownerCountry$(): Observable<any[]> {
    return this._ownerCountrySubject.asObservable();
  }

  // donor city
  loadDonorCity(searhValue?: string): void{
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('jiti.city', domain).then(res => {
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
        this._donorCitySubject.next(res.result.records);
      }
    });
  }

  get donorCity() {
    return this._donorCitySubject.value;
  }

  get donorCity$(): Observable<any[]> {
    return this._donorCitySubject.asObservable();
  }

  // donor province
  loadDonorProvince(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country.state', domain).then(res => {
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
        this._donorProvinceSubject.next(res.result.records);
      }
    });
  }

  get donorProvince() {
    return this._donorProvinceSubject.value;
  }

  get donorProvince$(): Observable<any[]> {
    return this._donorProvinceSubject.asObservable();
  }

  // donor country
  loadDonorCountry(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country', domain).then(res => {
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
        this._donorCountrySubject.next(res.result.records);
      }
    });
  }

  get donorCountry() {
    return this._donorCountrySubject.value;
  }

  get donorCountry$(): Observable<any[]> {
    return this._donorCountrySubject.asObservable();
  }

    // towing city
  loadTowingCity(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('jiti.city', domain).then(res => {
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
        this._towingCitySubject.next(res.result.records);
      }
    });
  }

  get towingCity() {
    return this._towingCitySubject.value;
  }

  get towingCity$(): Observable<any[]> {
    return this._towingCitySubject.asObservable();
  }

  // towing province
  loadTowingProvince(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country.state', domain).then(res => {
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
        this._towingProvinceSubject.next(res.result.records);
      }
    });
  }

  get towingProvince() {
    return this._towingProvinceSubject.value;
  }

  get towingProvince$(): Observable<any[]> {
    return this._towingProvinceSubject.asObservable();
  }

  // towing country
  loadTowingCountry(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.country', domain).then(res => {
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
        this._towingCountrySubject.next(res.result.records);
      }
    });
  }

  get towingCountry() {
    return this._towingCountrySubject.value;
  }

  get towingCountry$(): Observable<any[]> {
    return this._towingCountrySubject.asObservable();
  }

  // tires
  loadTires(searhValue?: string): void {
    const domain = [['category', '=', 'tires']];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.vehicle.status', domain).then(res => {
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
        this._tiresSubject.next(res.result.records);
      }
    });
  }

  get tires() {
    return this._tiresSubject.value;
  }

  get tires$(): Observable<any[]> {
    return this._tiresSubject.asObservable();
  }

  // wheels
  loadWheels(searhValue?: string): void {
    const domain = [['category', '=', 'wheels']];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.vehicle.status', domain).then(res => {
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
        this._wheelsSubject.next(res.result.records);
      }
    });
  }

  get wheels() {
    return this._wheelsSubject.value;
  }

  get wheels$(): Observable<any[]> {
    return this._wheelsSubject.asObservable();
  }

  // brakes
  loadBrakes(searhValue?: string): void {
    const domain = [['category', '=', 'brakes']];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.vehicle.status', domain).then(res => {
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
        this._brakesSubject.next(res.result.records);
      }
    });
  }

  get brakes() {
    return this._brakesSubject.value;
  }

  get brakes$(): Observable<any[]> {
    return this._brakesSubject.asObservable();
  }

  // location
  loadLocation(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.location', domain).then(res => {
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
        this._locationSubject.next(res.result.records);
      }
    });
  }

  get location() {
    return this._locationSubject.value;
  }

  get location$(): Observable<any[]> {
    return this._locationSubject.asObservable();
  }

  // language
  loadLanguage(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.lang', domain).then(res => {
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
        this._languageSubject.next(res.result.records);
      }
    });
  }

  get language() {
    return this._languageSubject.value;
  }

  get language$(): Observable<any[]> {
    return this._languageSubject.asObservable();
  }

  // language
  loadDonorLanguage(searhValue?: string): void {
    const domain: any[] | undefined = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('res.lang', domain).then(res => {
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
        this._donorLanguageSubject.next(res.result.records);
      }
    });
  }

  get donorLanguage() {
    return this._donorLanguageSubject.value;
  }

  get donorLanguage$(): Observable<any[]> {
    return this._donorLanguageSubject.asObservable();
  }

  // unit of measurement
  loadUom(searhValue?: string): Promise<boolean> {
    const domain: any[] = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('product.uom', domain, [], 0).then(resp => {
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
          this._unitOfMeasurementSubject.next(resp.result.records);
        }
        resolve(true);
      });
    });
  }

  get uom() {
    return this._unitOfMeasurementSubject.value;
  }

  get uom$(): Observable<any[]> {
    return this._unitOfMeasurementSubject.asObservable();
  }

  // color
  loadColor(searhValue?: string) {
    const domain = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('crm.vehicle.color', domain, [], 0).then(resp => {
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
        this._colorSubject.next(resp.result.records);
      }
    });
  }

  get color() {
    return this._colorSubject.value;
  }

  get color$(): Observable<any[]> {
    return this._colorSubject.asObservable();
  }

  // style
  loadStyle(searhValue?: string) {
    const domain = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('vin.model.style', domain).then(resp => {
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
        this._styleSubject.next(resp.result.records);
      }
    });
  }

  get style() {
    return this._styleSubject.value;
  }

  get style$(): Observable<any[]> {
    return this._styleSubject.asObservable();
  }

  // driveline
  loadDriveline(searhValue?: string) {
    const domain = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('vin.driving.wheels', domain, [], 0).then(resp => {
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
        this._driveLineSubject.next(resp.result.records);
      }
    });
  }

  get driveLine() {
    return this._driveLineSubject.value;
  }

  get driveLine$(): Observable<any[]> {
    return this._driveLineSubject.asObservable();
  }

  // engine type
  loadEngineType(searhValue?: string) {
    const domain = [];

    if (searhValue) {
      domain.push(['name', 'ilike', searhValue]);
    }

    this._odooSvc.searchValues('vin.engine.type', domain, [], 0).then(resp => {
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
        this._engineTypeSubject.next(resp.result.records);
      }
    });
  }

  get engineType() {
    return this._engineTypeSubject.value;
  }

  get engineType$(): Observable<any[]> {
    return this._engineTypeSubject.asObservable();
  }

  // default configuration
  loadDefaultConfiguration(): Promise<boolean> {
    const domain: any[] = [];

    return new Promise<boolean>((resolve) => {
      this._odooSvc.searchValues('ir.values', domain, [], 0).then(res => {
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
          this._defaultConfigurationSubject.next(res.result.records);
        }
        resolve(true);
      });
    });
  }

  get defaultConfiguration() {
    return this._defaultConfigurationSubject.value;
  }

  get defaultConfiguration$(): Observable<any[]> {
    return this._defaultConfigurationSubject.asObservable();
  }

  // vehicle missing part
  loadVehicleMissingPart(): void {
    const domain: any[] = [];

    this._odooSvc.searchValues('crm.vehicle.missing.part', domain, [], 0).then(res => {
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
        this._vehicleMissingPartSubject.next(res.result.records);
      }
    });
  }

  get vehicleMissingPart() {
    return this._vehicleMissingPartSubject.value;
  }

  get vehicleMissingPart$(): Observable<any[]> {
    return this._vehicleMissingPartSubject.asObservable();
  }

  get goodForSaleStatus() {
    const _goorForSale = this.isGoodCar;

    return _goorForSale &&
          !this.isAccidented && this.haveKeys && this.haveEngine && this.haveTransmission &&
          this.haveBattery && this.haveCatalyticConvertor && (this.haveTires || this.haveRims) && this.haveAC;
  }

  get isGoodCar() {
    const _goorForSale = this.goodCar.find(f =>
      f.make[0] === this.fg.controls['make'].value &&
      f.model[0] === this.fg.controls['model'].value &&
      f.year === Number(this.fg.controls['year'].value)
    );

    return _goorForSale?.is_export || _goorForSale?.is_truck || false;
  }

  get isAccidented(): boolean {
    return this.fg.controls['vehicleAccidented'].value === true;
  }

  get isDropOff(): boolean {
    return this.fg.controls['dropOff'].value === true;
  }

  get haveCarBody(): boolean {
    return this.fg.controls['carBody'].value === true;
  }

  get haveKeys(): boolean {
    return this.fg.controls['haveKeys'].value === true;
  }

  get haveEngine(): boolean {
    return this.fg.controls['haveEngine'].value === true;
  }

  get haveEngineIndeterminate(): boolean {
    return this.fg.controls['haveEngine'].value === '';
  }

  get engineRun(): boolean {
    return this.fg.controls['engineRun'].value === true;
  }

  get haveTransmission(): boolean {
    return this.fg.controls['haveTransmission'].value === true;
  }

  get haveTransmissionIndeterminate(): boolean {
    return this.fg.controls['haveTransmission'].value === '';
  }

  get haveBattery(): boolean {
    return this.fg.controls['haveBattery'].value === true;
  }

  get haveBatteryIndeterminate(): boolean {
    return this.fg.controls['haveBattery'].value === '';
  }

  get haveCatalyticConvertor(): boolean {
    return this.fg.controls['haveCatalyticConvertor'].value === true;
  }

  get haveCatalyticConvertorIndeterminate(): boolean {
    return this.fg.controls['haveCatalyticConvertor'].value === '';
  }

  get haveTires(): boolean {
    return this.fg.controls['haveTires'].value === true;
  }

  get haveTiresIndeterminate(): boolean {
    return this.fg.controls['haveTires'].value === '';
  }

  get haveRims(): boolean {
    return this.fg.controls['haveRims'].value === true;
  }

  get haveRimsIndeterminate(): boolean {
    return this.fg.controls['haveRims'].value === '';
  }

  get haveAC(): boolean {
    return this.fg.controls['haveAC'].value === true;
  }

  get havePapers(): boolean {
    return this.fg.controls['haveOwnershipPaper'].value === true;
  }

  get powerAttorney(): boolean {
    return this.fg.controls['powerAttorney'].value === true;
  }

  get vehicleHybrid(): boolean {
    return this.fg.controls['vehicleHybrid'].value === true;
  }

  get charityAction(): boolean {
    return this.actions.find(f => f.id === this.fg.controls['action'].value)?.is_charity;
  }

  get carInImpoundGarage(): boolean {
    return this.fg.get('carLocation')?.value === this._IMPOUND_GARAGE_DDEFAULT_VALUE;
  }

  get offerAccepted(): boolean {
    return this.fg.controls['offerAccepted'].value === true;
  }

  get missingPartTabValid(): boolean {
    const haveEngine = this.fg.get('haveEngine')?.value;
    const engineRun = this.fg.get('engineRun')?.value;
    const engineLight = this.fg.get('engineLight')?.value;
    const haveTransmission = this.fg.get('haveTransmission')?.value;
    const transmissionRunning = this.fg.get('transmissionRunning')?.value;
    const rust = this.fg.get('rust')?.value;
    const haveBattery = this.fg.get('haveBattery')?.value;
    const haveCatalyticConvertor = this.fg.get('haveCatalyticConvertor')?.value;
    const haveTires = this.fg.get('haveTires')?.value;
    const haveRims = this.fg.get('haveRims')?.value;
    const haveAC = this.fg.get('haveAC')?.value;
    const mechanicalNote = this.fg.get('mechanicalNote')?.value;

    // tslint:disable-next-line: max-line-length
    return (haveEngine === false || haveEngine === true && (!this.goodForSaleStatus || (this.goodForSaleStatus && (engineRun === false || (engineRun === true && engineLight !== ''))))) &&
      // tslint:disable-next-line: max-line-length
      (haveTransmission === false || haveTransmission === true && (!this.goodForSaleStatus || (this.goodForSaleStatus && transmissionRunning !== ''))) &&
      rust !== '' && haveBattery !== '' && haveCatalyticConvertor !== '' &&
      (haveTires === true || (haveTires === false && haveRims !== '')) && haveAC !== '';
  }

  get offerTabValid(): boolean {
    const costumerExpectation = this.fg.get('costumerExpectation')?.value;
    const agentOffer = this.fg.get('agentOffer')?.value;

    return costumerExpectation && agentOffer;
  }

  get secondaryInfoTabValid(): boolean {
    const color = this.fg.get('color')?.value;
    const transmission = this.fg.get('transmission')?.value;
    const driveline = this.fg.get('driveline')?.value;

    return color && transmission && driveline;
  }

  get supplierTabValid(): boolean {
    const supplier = this.fg.get('supplier')?.value;
    const contactSource = this.fg.get('contactSource')?.value;

    return supplier;
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  set selectedTabIndex(tab: number) {
    this._selectedTabIndex = tab;
  }

  get offerDifference(): number {
    const expectation = Number(this.fg.controls['costumerExpectation'].value);
    const offers = Number(this.fg.controls['secondOffer'].value) === 0 ?
                  Number(this.fg.controls['agentOffer'].value) :
                  Number(this.fg.controls['secondOffer'].value);

    return expectation - offers;
  }

  get missingPartEngineUnitPrice(): number {
    const defaultMissingPartEngine = this.defaultConfiguration.find(f => f.name === 'default_missing_part_engine');
    const missingPartUnitPrice = defaultMissingPartEngine ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartEngine.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get missingPartTransmissionUnitPrice(): number {
    const defaultMissingPartTransmission = this.defaultConfiguration.find(f => f.name === 'default_missing_part_transmission');
    const missingPartUnitPrice = defaultMissingPartTransmission ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartTransmission.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get missingPartBatteryUnitPrice(): number {
    const defaultMissingPartBattery = this.defaultConfiguration.find(f => f.name === 'default_missing_part_battery');
    const missingPartUnitPrice = defaultMissingPartBattery ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartBattery.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get missingPartCatalyticUnitPrice(): number {
    const defaultMissingPartCatalytic = this.defaultConfiguration.find(f => f.name === 'default_missing_part_catalytic');
    const missingPartUnitPrice = defaultMissingPartCatalytic ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartCatalytic.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get missingPartTiresUnitPrice(): number {
    const defaultMissingPartTires = this.defaultConfiguration.find(f => f.name === 'default_missing_part_tires');
    const missingPartUnitPrice = defaultMissingPartTires ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartTires.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get missingPartRimsUnitPrice(): number {
    const defaultMissingPartRims = this.defaultConfiguration.find(f => f.name === 'default_missing_part_rims');
    const missingPartUnitPrice = defaultMissingPartRims ?
          this.vehicleMissingPart.find(f => f.id.toString() === defaultMissingPartRims.value_unpickle)?.price_unit :
          0;
    return missingPartUnitPrice;
  }

  get defaultGrossWeight(): string {
    const _defaultGrossWeight = this.defaultConfiguration.find(f => f.name === 'product_gross_weight');
    return _defaultGrossWeight?.value_unpickle || '';
  }

  get defaultGrossWeightUom(): string | number {
    const _defaultGrossWeightUom = this.defaultConfiguration.find(f => f.name === 'product_gross_weight_uom');
    return Number(_defaultGrossWeightUom?.value_unpickle) || '';
  }

  get defaultFreeOfDebt(): string | boolean {
    const _defaultFreeOfDebt = this.defaultConfiguration.find(f => f.name === 'is_free_of_encumbrance');
    return _defaultFreeOfDebt?.value_unpickle || false;
  }

  get isActionOpportunity(): boolean {
    const _action = this.actions.find(a => a.id === this._fromGroupService.fg.get('action')?.value);
    return _action ? _action.allow_create_an_opp : false;
  }

  goNextTab() {
    this._selectedTabIndex += 1;
  }

  async getNewOpportunity(): Promise<any> {
    const courtesyModel = 'purchase.config.settings';
    const courtesyMethod = 'get_default_courtesy_call_minutes';
    const args = this.fg.get('company')?.value;
    const _supplier = this.suppliers.find(s => s.id === this.fg.get('supplier')?.value);

    const courtesyResp = await this._odooSvc.callMethod(courtesyModel, courtesyMethod, [args]);
    if (courtesyResp.error) {
      throw new Error(courtesyResp.error.data.message);
    }

    return {
      name: '/',
      company_id: this.fg.get('company')?.value,
      create_uid: this._userSvc.user.uid,
      supplier: this.fg.get('supplier')?.value,
      charity_program_type: _supplier.charity_program_type,
      program_type_is_charity: this.charityAction,
      fiscal_position: this.fg.get('fiscalPosition')?.value,
      reference: _supplier.driver_license_reference,
      courtesy_call_minutes: courtesyResp.result.courtesy_call_minutes,
      owner_name: this.fg.get('isSupplierOwner')?.value === true ?
                  _supplier.name :
                  this.fg.get('owner')?.value,
      owner_zip: this.fg.get('isSupplierOwner')?.value === true ?
                  this.fg.get('supplierPostalCode')?.value :
                  this.fg.get('ownerPostalCode')?.value,
      owner_email: this.fg.get('isSupplierOwner')?.value === true ?
                  (_supplier.email === false ? '' : _supplier.email) : '',
      owner_phone: this.fg.get('isSupplierOwner')?.value === true ?
                  this.fg.get('supplierPhone')?.value :
                  this.fg.get('ownerPhone')?.value,
      is_drop_off: this.fg.get('dropOff')?.value,
    };
  }

  async getWriteOpportunity(): Promise<any> {
    const _supplier = this.suppliers.find(s => s.id === this.fg.get('supplier')?.value);
    return {
      donnor_note: this.fg.get('callNote')?.value,
      price_unit: this.fg.get('costumerExpectation')?.value,
      refusal_reason: this.fg.get('refusalReason')?.value,
      towing_jiti_city: this.fg.get('towingCity')?.value,
      donor_card_in_memory_of: this.fg.get('donorCardInMemoryOf')?.value,
      towing_phone: this.fg.get('towingPhone')?.value,
      driving_wheels: this.fg.get('driveline')?.value,
      missing_tires_amount: this.fg.get('tiresDeduction')?.value,
      // battery: this.fg.get('')?.value,
      donor_phone: this.fg.get('donorPhone')?.value,
      vehicle_has_transmission: this.fg.get('haveTransmission')?.value,
      donor_city: this.fg.get('donorCity')?.value,
      towing_country_id: this.fg.get('towingCountry')?.value,
      donor_email: this.fg.get('donorEmail')?.value,
      front: this.fg.get('front')?.value,
      has_zero_price: this.fg.get('carBody')?.value,
      trasmission: this.fg.get('transmission')?.value,
      towing_state_id: this.fg.get('towingProvince')?.value,
      missing_battery_amount: this.fg.get('batteryDeduction')?.value,
      towing_garage: this.carInImpoundGarage,
      // final_status: 3,
      vehicle_engine_light: this.fg.get('engineLight')?.value  ? 'yes' : 'no',
      summary_pickup_date: this.fg.get('date')?.value,
      missing_tires_quantity: this.fg.get('missingQuantityTires')?.value,
      right: this.fg.get('right')?.value,
      has_ownership_paper: this.fg.get('haveOwnershipPaper')?.value,
      towing_street: this.fg.get('towingAddress')?.value,
      back: this.fg.get('back')?.value,
      tires: this.fg.get('tires')?.value ? [[6, false, [this.fg.get('tires')?.value]]] : [],
      body_type: this.fg.get('bodyType')?.value,
      year: this.fg.get('year')?.value,
      summary_pickup_type: this.fg.get('pickupType')?.value,
      donor_commemorative_card: this.fg.get('donorCommemorativeCard')?.value,
      donor_state_id: this.fg.get('donorProvince')?.value,
      owner_city: this.fg.get('isSupplierOwner')?.value === true ?
                  _supplier.city :
                  this.fg.get('ownerCity')?.value,
      model_style: this.fg.get('style')?.value,
      price_expectation: this.fg.get('costumerExpectation')?.value,
      is_charity: this.charityAction ? 'yes' : 'no',
      accident: this.fg.get('vehicleAccidented')?.value,
      towing_zip: this.fg.get('towingPostalCode')?.value,
      id_drop_off: this.fg.get('dropOff')?.value,
      donor_jiti_city: this.fg.get('donorCity')?.value,
      missing_battery_price_unit: this.fg.get('batteryDeduction')?.value,
      vehicle_has_catalyst: this.fg.get('haveCatalyticConvertor')?.value,
      missing_catalyst_quantity: this.fg.get('catalyticConvertorDeduction')?.value,
      wheels: this.fg.get('wheels')?.value ? [[6, false, [this.fg.get('wheels')?.value]]] : [],
      vin_number: this.fg.get('vin')?.value,
      vehicle_has_engine: this.fg.get('haveEngine')?.value,
      color: this.fg.get('color')?.value,
      vehicle_has_tires: this.fg.get('haveTires')?.value,
      certificate_number: this.fg.get('certificate')?.value,
      second_line_offer: this.fg.get('secondOffer')?.value,
      missing_catalyst_price_unit: this.fg.get('catalyticConvertorDeduction')?.value,
      brakes: this.fg.get('brakes')?.value ? [[6, false, [this.fg.get('brakes')?.value]]] : [],
      supplier_preferred_lang: this.fg.get('preferredLanguage')?.value,
      contact_source_id: this.fg.get('contactSource')?.value,
      donor_tax_credit_by_email: this.fg.get('donorTaxCreditByEmail')?.value,
      owner_street: this.fg.get('isSupplierOwner')?.value === true ?
                  this.fg.get('supplierAddress')?.value :
                  this.fg.get('ownerAddress')?.value,
      // car_starts: this.fg.get('')?.value,
      donor_country_id: this.fg.get('supplierCountry')?.value,
      first_offer: this.fg.get('agentOffer')?.value,
      missing_tires_price_unit: 1,
      same_zip_supplier: this.fg.get('isSupplierOwner')?.value,
      owner_state_id: this.fg.get('isSupplierOwner')?.value === true ?
                  this.fg.get('supplierProvince')?.value :
                  this.fg.get('ownerProvince')?.value,
      engine_size: this.fg.get('engineSize')?.value,
      towing_name: this.fg.get('contactName')?.value,
      is_the_towing: this.fg.get('towingAddressOption')?.value,
      donor_mobile: this.fg.get('donorMobile')?.value,
      donor_zip: this.fg.get('donorPostalCode')?.value,
      donor_street: this.fg.get('donorAddress')?.value,
      second_line_agent: this.fg.get('secondAgent')?.value,
      pickup_location: this.fg.get('carLocation')?.value,
      payment_method_id: this.fg.get('paymentMethod')?.value,
      engine_run: this.fg.get('engineRun')?.value,
      make: this.fg.get('make')?.value,
      has_keys: this.fg.get('haveKeys')?.value,
      // damage: this.fg.get('')?.value,
      towing_mobile: this.fg.get('towingCellulaire')?.value,
      // other: this.fg.get('')?.value,
      transmission_running: this.fg.get('transmissionRunning')?.value,
      engine_type: this.fg.get('engineType')?.value,
      donor_correspondance_lang: this.fg.get('donorLanguage')?.value,
      mileage: Number(this.fg.get('mileage')?.value) * 1000,
      // atac: this.fg.get('')?.value,
      owner_country_id: this.fg.get('isSupplierOwner')?.value === true ?
                  this.fg.get('supplierCountry')?.value :
                  this.fg.get('ownerCountry')?.value,
      vehicle_postal_code: this.fg.get('vehiclePostalCode')?.value,
      is_the_supplier_the_owner: this.fg.get('isSupplierOwner')?.value,
      donor_name: this.fg.get('donor')?.value,
      delay_reason: this.fg.get('delayReason')?.value,
      is_the_owner_the_donor: this.fg.get('isOwnerDonor')?.value,
      vehicle_has_battery: this.fg.get('haveBattery')?.value,
      missing_battery_quantity: this.fg.get('batteryDeduction')?.value,
      hybrid_note: this.fg.get('hybridNote')?.value,
      is_hybrid: this.fg.get('vehicleHybrid')?.value ? 'yes' : 'no',
      model: this.fg.get('model')?.value,
      registration_number: this.fg.get('vin')?.value,
      left: this.fg.get('left')?.value,
      vin_checksum: this.fg.get('checksum')?.value,
      product_gross_weight: this.fg.get('grossWeight')?.value,
      product_gross_weight_uom: this.fg.get('uom')?.value
    };
  }

  getPhoneCall() {
    const _supplier = this.suppliers.find(s => s.id === this.fg.get('supplier')?.value);

    return {
      name: '/',
      partner_id: _supplier.id,
      partner_email: _supplier.email === false ? '' : _supplier.email,
      partner_phone: this.fg.get('supplierPhone')?.value,
      partner_zip: this.fg.get('supplierPostalCode')?.value,
      company_id: this.fg.get('company')?.value,
      date: new Date(),
      user_id: this._userSvc.user.uid,
      purchase_opportunity: 0,
      action_id: this.fg.get('action')?.value,
      state: 'done'
    };
  }

}
