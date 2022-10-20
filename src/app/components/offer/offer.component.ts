import { AddEditAgentService } from './../../shared/services/add-edit-agent.service';
import { Subscription } from 'rxjs';
import { AddEditAgentComponent } from './../../shared/components/add-edit-agent/add-edit-agent.component';
import { OdooService } from './../../shared/services/odoo.service';
import { AddEditReasonComponent } from './../../shared/components/add-edit-reason/add-edit-reason.component';
import { ModalService } from './../../shared/services/modal.service';
import { AddEditReasonService } from './../../shared/services/add-edit-reason.service';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroupService } from '../../shared/services/form-group.service';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { _isNumberValue } from '@angular/cdk/coercion';
import { CallCenterService } from 'src/app/shared/services/call-center.service';
import SweetAlert from 'sweetalert2';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  agentValues!: ISelectableList[];

  fg!: FormGroup;

  labelPosition: 'before' | 'after' = 'before';
  refusalReasonValues: ISelectableList[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService,
    private _odooSvc: OdooService,
    private _modalSvc: ModalService,
    private _addEditReasonSvc: AddEditReasonService,
    private _addEditAgentSvc: AddEditAgentService,
  ) {
    _callCenterService.agent$.subscribe(agent => {
      if (agent) {
        this.agentValues = agent.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      this.agentValues.push({
        value: -1,
        description: 'Create...'
      });
    });

    _callCenterService.reason$.subscribe(refReason => {
      if (refReason) {
        this.refusalReasonValues = refReason.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      this.refusalReasonValues.push({
        value: -1,
        description: 'Create...'
      });
    });
  }

  ngOnInit(): void {
    this.fg = this._formGroupService.fg;

    this._subscribeToFormChange();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe);
  }

  private _subscribeToFormChange() {
    this.subscription.push(this.fg.controls['secondAgent'].valueChanges.subscribe(value => {
      if (value === -1) {
        this.fg.controls['secondAgent'].setValue(this.fg.value.secondAgent);
        this._addEditReasonSvc.resetFg();
        this._addEditReasonSvc.fgControl = 'action';
        this._modalSvc.openModal(AddEditAgentComponent);
      }
    }));

    this.subscription.push(this.fg.controls['offerAccepted'].valueChanges.subscribe(() => {
      this.fg.controls['secondOffer'].setValue('');
      this.fg.controls['secondAgent'].setValue('');
      this.fg.controls['refusalReason'].setValue('');
    }));
  }

  totalMissingParts(): number {
    const missingTires = this.fg.controls['missingQuantityTires'].value || 0;
    const missingRims = this.fg.controls['missingQuantityRims'].value || 0;

    return Number(missingTires) + Number(missingRims);
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get offerDifference(): number {
    return this._callCenterService.offerDifference;
  }

  get offerTabValid() {
    return this._callCenterService.offerTabValid;
  }

  get offerAccepted() {
    return this._callCenterService.offerAccepted;
  }

  goNextTab() {
    this._callCenterService.goNextTab();
  }

  filterAgent(value: string) {
    this._callCenterService.loadAgents(value);
  }

  filterReason(value: string) {
    this._callCenterService.loadReason(value);
  }

  editAgent(idAgent: number | string) {
    const domain = [['id', '=', idAgent]];
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
        const user = res.result.records[0];
        const payload = {
          id: user.id,
          name: user.name,
          login: user.login,
          language: user.lang,
          email: user.email,
          active: user.active,
        };
        this._addEditAgentSvc.fg.patchValue(payload);
        this._modalSvc.openModal(AddEditAgentComponent);
      }
    });
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
