import { Router } from '@angular/router';
import { ModalService } from '../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { CallCenterService } from '../../shared/services/call-center.service';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroupService } from '../../shared/services/form-group.service';
import { FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { isArray } from 'lodash';

@Component({
  selector: 'app-new-call',
  templateUrl: './new-call.component.html',
  styleUrls: ['./new-call.component.scss']
})
export class NewCallComponent implements OnInit, OnDestroy {
  today = new Date();
  supplier: any;

  fg!: FormGroup;
  actionsValues: ISelectableList[] = [];
  supplierValues: ISelectableList[] = [];
  companyValues: ISelectableList[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService,
    private _userService: UserService,
    private _modalService: ModalService,
    private _router: Router,
  ) {
    this.fg = _formGroupService.fg;

    _callCenterService.actions$.subscribe(action => {
      if (action) {
        this.actionsValues = action.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.suppliers$.subscribe(supplier => {
      if (supplier) {
        this.supplierValues = supplier.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.company$.subscribe(company => {
      if (company) {
        this.companyValues = company.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });
   }

  ngOnInit(): void {
    this._callCenterService.loadActions();

    this._callCenterService.loadSuppliers();

    this._callCenterService.loadCompany();

    this._subscribeToFgValueChange();
  }

  ngOnDestroy() {
    this.subscription.forEach(subs => {
      subs.unsubscribe();
    });
  }

  private _subscribeToFgValueChange() {
    this.subscription.push(this.fg.controls['action'].valueChanges.subscribe(value => {
      const _action = this._callCenterService.actions.find(act => act.id === value);
      console.log(_action);
      const _supplierValue = isArray(_action.partner_id) ? _action.partner_id[0] : '';
      this.fg.controls['supplier'].setValue(_supplierValue);
    }));

    this.subscription.push(this.fg.controls['supplier'].valueChanges.subscribe(value => {
      this.supplier = this._callCenterService.suppliers.find(s => s.id === value);

      if (this.supplier) {
        const inputValue = {
          phone: this.supplier.phone === false ? '' : this.supplier.phone,
          email: this.supplier.email === false ? '' : this.supplier.email,
          supplierAddress: this.supplier.street === false ? '' : this.supplier.street,
          vehiclePostalCode: this.supplier.zip,
          supplierPostalCode: this.supplier.zip,
        };

        this.fg.patchValue(inputValue);
      }
    }));
  }

  get responsable() {
    return this._userService.user.username;
  }

  get isFgValid(): boolean {
    return this.fg.controls['action'].value && this.fg.controls['supplier'].value && this.fg.controls['company'].value;
  }

  filterAction(value: string) {
    this._callCenterService.loadActions(value);
  }

  filterSupplier(value: string) {
    this._callCenterService.loadSuppliers(value);
  }

  filterCompany(value: string) {
    this._callCenterService.loadCompany(value);
  }

  createCall() {
    this._modalService.closeModal();
    this._router.navigateByUrl('call');
  }

  abortCall() {
    const inputValue = {
      action: '',
      supplier: '',
      company: '',
      callNote: ''
    };
    this.fg.patchValue(inputValue);

    this._modalService.closeModal();
  }

}
