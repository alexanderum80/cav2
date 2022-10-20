import { AddEditReasonService } from './../../shared/services/add-edit-reason.service';
import { AddEditReasonComponent } from './../../shared/components/add-edit-reason/add-edit-reason.component';
import { Subscription } from 'rxjs';
import { ShowMoreComponent } from './../../shared/components/show-more/show-more.component';
import SweetAlert from 'sweetalert2';
import { ModalService } from '../../shared/services/modal.service';
import { ShowMoreService } from '../../shared/services/show-more.service';
import { OdooService } from '../../shared/services/odoo.service';
import { DEFAULT_RECORD_LIMIT } from '../../shared/models/odoo.model';
import { CallCenterService } from '../../shared/services/call-center.service';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroupService } from '../../shared/services/form-group.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-towing-and-recap',
  templateUrl: './towing-and-recap.component.html',
  styleUrls: ['./towing-and-recap.component.scss']
})
export class TowingAndRecapComponent implements OnInit, OnDestroy {
  fg!: FormGroup;

  labelPosition: 'before' | 'after' = 'before';

  pickupValues: ISelectableList[] = [];
  paymentMethodValues: ISelectableList[] = [];
  delayReasonValues: ISelectableList[] = [];
  cityValues: ISelectableList[] = [];
  provinceValues: ISelectableList[] = [];
  countryValues: ISelectableList[] = [];

  towingAddressOptionValues: ISelectableList[] = [
    { value: 'enter_manually', description: 'Enter manually' },
    { value: 'same_as_supplier', description: 'Same as Supplier' },
    { value: 'same_as_owner', description: 'Same as Owner' },
  ];

  wheelsValues: ISelectableList[] = [];

  tiresValues: ISelectableList[] = [];

  brakesValues: ISelectableList[] = [];

  locationValues: ISelectableList[] = [];

  minDate = new Date();

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService,
    private _odooSvc: OdooService,
    private _showMoreSvc: ShowMoreService,
    private _modalSvc: ModalService,
    private _addEditReasonSvc: AddEditReasonService
  ) {
    _callCenterService.pickupType$.subscribe(pickup => {
      if (pickup) {
        this.pickupValues = pickup.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.paymentMethod$.subscribe(payments => {
      if (payments) {
        this.paymentMethodValues = payments.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
    });

    _callCenterService.reason$.subscribe(reason => {
      if (reason) {
        this.delayReasonValues = reason.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
      this.delayReasonValues.push({
        value: -1,
        description: 'Create...'
      });
    });

    _callCenterService.ownerCity$.subscribe(cities => {
      if (cities) {
        this.cityValues = cities.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.cityValues.length === DEFAULT_RECORD_LIMIT) {
        this.cityValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.ownerProvince$.subscribe(province => {
      if (province) {
        this.provinceValues = province.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.provinceValues.length === DEFAULT_RECORD_LIMIT) {
        this.provinceValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.ownerCountry$.subscribe(country => {
      if (country) {
        this.countryValues = country.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.countryValues.length === DEFAULT_RECORD_LIMIT) {
        this.countryValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.tires$.subscribe(tires => {
      if (tires) {
        this.tiresValues = tires.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
    });

    _callCenterService.wheels$.subscribe(wheels => {
      if (wheels) {
        this.wheelsValues = wheels.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
    });

    _callCenterService.brakes$.subscribe(brakes => {
      if (brakes) {
        this.brakesValues = brakes.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
    });

    _callCenterService.location$.subscribe(location => {
      if (location) {
        this.locationValues = location.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
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

  filterPickupType(value: string) {
    this._callCenterService.loadPickupType(value);
  }

  filterpaymentMethod(value: string) {
    this._callCenterService.loadPaymentMethod(value);
  }

  filterReason(value: string) {
    this._callCenterService.loadReason(value);
  }

  filterTowingCity(value: string) {
    this._callCenterService.loadTowingCity(value);
  }

  filterTowingProvince(value: string) {
    this._callCenterService.loadTowingProvince(value);
  }

  filterTowingCountry(value: string) {
    this._callCenterService.loadTowingCountry(value);
  }

  filterWheels(value: string) {
    this._callCenterService.loadWheels(value);
  }

  filterTires(value: string) {
    this._callCenterService.loadTires(value);
  }

  filterBrakes(value: string) {
    this._callCenterService.loadBrakes(value);
  }

  filterLocation(value: string) {
    this._callCenterService.loadLocation(value);
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get haveTires() {
    return this._callCenterService.haveTires;
  }

  get haveTransmission() {
    return this._callCenterService.haveTransmission;
  }

  get isDropOff() {
    return this._callCenterService.isDropOff;
  }

  get vehicleHybrid() {
    return this._callCenterService.vehicleHybrid;
  }

  get goodForSale() {
    return this._callCenterService.goodForSaleStatus;
  }

  get charityAction(): boolean {
    return this._callCenterService.charityAction;
  }

  get carInImpoundGarage(): boolean {
    return this._callCenterService.carInImpoundGarage;
  }

  get canEditDelayReason() {
    const date = new Date(this.fg.get('date')?.value);
    const pickup = new Date(this.fg.get('pickupDate')?.value || date);

    const diff = (pickup.valueOf() - date.valueOf()) / 1000 / 60 / 60;
    return diff > 48;
  }

  get differentCarLocation(): boolean {
    return this.fg.get('differentCarLocation')?.value === true;
  }

  get isActionOpportunity(): boolean {
    return this._callCenterService.isActionOpportunity;
  }

  private _subscribeToFgChange() {
    this.subscription.push(this.fg.controls['towingAddressOption'].valueChanges.subscribe(value => {
      this._callCenterService.fillTowingAddress();
    }));

    this.subscription.push(this.fg.controls['towingCity'].valueChanges.subscribe(value => {
      const city = this._callCenterService.ownerCity.find(f => f.id === value);

      if (city) {
        const inputValue = {
          towingProvince: city.state[0],
          towingCountry: city.country[0]
        };

        this.fg.patchValue(inputValue);
      }

      if (value === 0) {
        this.fg.controls['towingCity'].setValue('');
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
            this._showMoreSvc.fgField = 'towingCity';
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

    this.subscription.push(this.fg.controls['towingProvince'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['towingProvince'].setValue('');
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
            this._showMoreSvc.fgField = 'towingProvince';
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

    this.subscription.push(this.fg.controls['towingCountry'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['towingCountry'].setValue('');
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
            this._showMoreSvc.fgField = 'towingCountry';
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

    this.subscription.push(this.fg.controls['differentCarLocation'].valueChanges.subscribe(value => {
      this.fg.controls['carLocation'].setValue('');
    }));
  }

  editReason(idAction: number | string) {
    const domain = [['id', '=', idAction]];
    this._odooSvc.searchValues('crm.purchase.lead.reason', domain).then(res => {
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
        const action = res.result.records[0];
        console.log(action);
        const payload = {
          id: action.id,
          name: action.name,
        };
        this._addEditReasonSvc.fg.patchValue(payload);
        this._modalSvc.openModal(AddEditReasonComponent);
      }
    });
  }

}
