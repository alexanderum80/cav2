import { Subscription } from 'rxjs';
import { YesNoOptions, ISelectableList } from '../../shared/models/interface-def.model';
import { CallCenterService } from '../../shared/services/call-center.service';
import { MyErrorStateMatcher } from '../../shared/models/material-error-state-matcher';
import { FormGroupService } from '../../shared/services/form-group.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { _isNumberValue } from '@angular/cdk/coercion';
import { update } from 'lodash';

@Component({
  selector: 'app-missing-parts',
  templateUrl: './missing-parts.component.html',
  styleUrls: ['./missing-parts.component.scss']
})
export class MissingPartsComponent implements OnInit, OnDestroy {
  fg!: FormGroup;
  value = 'Clear me';
  labelPosition: 'before' | 'after' = 'before';

  matcher = new MyErrorStateMatcher();

  yesNoOptions = YesNoOptions;

  rustValues: ISelectableList[] = [
    { value: 'light', description: 'Light' },
    { value: 'medium', description: 'Medium' },
    { value: 'heavy', description: 'Heavy' },
  ];

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService
  ) { }

  ngOnInit(): void {
    this.fg = this._formGroupService.fg;
    this._subscribeToFormChange();
  }

  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _subscribeToFormChange() {
    this.subscription.push(this.fg.controls['haveEngine'].valueChanges.subscribe(value => {
      this.fg.controls['engineRun'].setValue('');
      this.fg.controls['engineLight'].setValue('');

      const deduction = value === true ? 0 : this._callCenterService.missingPartEngineUnitPrice;
      this.fg.controls['engineDeduction'].setValue(deduction);
    }));

    this.subscription.push(this.fg.controls['haveTransmission'].valueChanges.subscribe(value => {
      this.fg.controls['transmissionRunning'].setValue('');

      const deduction = value === true ? 0 : this._callCenterService.missingPartTransmissionUnitPrice;
      this.fg.controls['transmissionDeduction'].setValue(deduction);
    }));

    this.subscription.push(this.fg.controls['haveBattery'].valueChanges.subscribe(value => {
      const deduction = value === true ? 0 : this._callCenterService.missingPartBatteryUnitPrice;
      this.fg.controls['batteryDeduction'].setValue(deduction);
    }));

    this.subscription.push(this.fg.controls['haveCatalyticConvertor'].valueChanges.subscribe(value => {
      const deduction = value === true ? 0 : this._callCenterService.missingPartCatalyticUnitPrice;
      this.fg.controls['catalyticConvertorDeduction'].setValue(deduction);
    }));

    this.subscription.push(this.fg.controls['haveTires'].valueChanges.subscribe(value => {
      const missingQty = value === true ? 0 : 4;
      this.fg.controls['missingQuantityTires'].setValue(missingQty);
    }));

    this.subscription.push(this.fg.controls['haveRims'].valueChanges.subscribe(value => {
      const missingQty = value === true ? 0 : 4;
      this.fg.controls['missingQuantityRims'].setValue(missingQty);
    }));

    this.subscription.push(this.fg.controls['missingQuantityTires'].valueChanges.subscribe(value => {
      if (value && !_isNumberValue(value)) {
        this.fg.controls['missingQuantityTires'].setErrors({ numberValue: true });
      } else {
        this.fg.controls['missingQuantityTires'].setErrors(null);

        const deduction = this._callCenterService.missingPartTiresUnitPrice;
        this.fg.controls['tiresDeduction'].setValue(deduction);
      }
    }));

    this.subscription.push(this.fg.controls['missingQuantityRims'].valueChanges.subscribe(value => {
      if (value && !_isNumberValue(value)) {
        this.fg.controls['missingQuantityRims'].setErrors({ numberValue: true });
      } else {
        this.fg.controls['missingQuantityRims'].setErrors(null);

        const deduction = this._callCenterService.missingPartRimsUnitPrice;
        this.fg.controls['rimsDeduction'].setValue(deduction);
      }
    }));

    this.subscription.push(this.fg.controls['engineDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['transmissionDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['batteryDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['catalyticConvertorDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['missingQuantityTires'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['tiresDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['missingQuantityRims'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));

    this.subscription.push(this.fg.controls['rimsDeduction'].valueChanges.subscribe(value => {
      this._updateTotalDeduction();
    }));
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get haveEngine(): boolean {
    return this._callCenterService.haveEngine;
  }

  get haveEngineIndeterminate(): boolean {
    return this._callCenterService.haveEngineIndeterminate;
  }

  get engineRun(): boolean {
    return this._callCenterService.engineRun;
  }

  get haveTransmission(): boolean {
    return this._callCenterService.haveTransmission;
  }

  get haveTransmissionIndeterminate(): boolean {
    return this._callCenterService.haveTransmissionIndeterminate;
  }

  get haveBattery(): boolean {
    return this._callCenterService.haveBattery;
  }

  get haveBatteryIndeterminate(): boolean {
    return this._callCenterService.haveBatteryIndeterminate;
  }

  get haveCatalyticConvertor(): boolean {
    return this._callCenterService.haveCatalyticConvertor;
  }

  get haveCatalyticConvertorIndeterminate(): boolean {
    return this._callCenterService.haveCatalyticConvertorIndeterminate;
  }

  get haveTires(): boolean {
    return this._callCenterService.haveTires;
  }

  get haveTiresIndeterminate(): boolean {
    return this._callCenterService.haveTiresIndeterminate;
  }

  get haveRims(): boolean {
    return this._callCenterService.haveRims;
  }

  get haveRimsIndeterminate(): boolean {
    return this._callCenterService.haveRimsIndeterminate;
  }

  get goodCar() {
    return this._callCenterService.goodCar;
  }

  get missingPartTabValid() {
    return this._callCenterService.missingPartTabValid;
  }

  private _updateTotalDeduction() {
    const engineDeduction = this.fg.get('engineDeduction')?.value || 0;
    const transmissionDeduction = this.fg.get('transmissionDeduction')?.value || 0;
    const batteryDeduction = this.fg.get('batteryDeduction')?.value || 0;
    const catalyticConvertorDeduction = this.fg.get('catalyticConvertorDeduction')?.value || 0;
    // tslint:disable-next-line: max-line-length
    const tiresDeduction = Number(this.fg.get('missingQuantityTires')?.value || 0) * Number(this.fg.get('tiresDeduction')?.value || 0);
    // tslint:disable-next-line: max-line-length
    const rimsDeduction = Number(this.fg.get('missingQuantityRims')?.value || 0) *  Number(this.fg.get('rimsDeduction')?.value || 0);

    const totalDeduction = (Number(engineDeduction) + Number(transmissionDeduction) + Number(batteryDeduction) +
          Number(catalyticConvertorDeduction) + Number(tiresDeduction) + Number(rimsDeduction)) || 0;

    this.fg.controls['missingPartsDeduction'].setValue(totalDeduction);
  }

  goNextTab() {
    this._callCenterService.goNextTab();
  }

}
