import { Subscription } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { CallCenterService } from 'src/app/shared/services/call-center.service';
import { OdooService } from '../../shared/services/odoo.service';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroupService } from '../../shared/services/form-group.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vehicle-secondary-info',
  templateUrl: './vehicle-secondary-info.component.html',
  styleUrls: ['./vehicle-secondary-info.component.scss']
})
export class VehicleSecondaryInfoComponent implements OnInit, OnDestroy {
  fg!: FormGroup;

  labelPosition: 'before' | 'after' = 'before';

  transmissionValues: ISelectableList[] = [
    { value: 'automatic', description: 'Automatic' },
    { value: 'manual', description: 'Manual' }
  ];

  styleList: any[] = [];
  colorValues: ISelectableList[] = [];
  engineSizeValues: ISelectableList[] = [];
  bodyTypeValues: ISelectableList[] = [];
  styleValues: ISelectableList[] = [];
  drivelineValues: ISelectableList[] = [];
  engineTypeValues: ISelectableList[] = [];
  uomValues: ISelectableList[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService
  ) {
    _callCenterService.color$.subscribe(color => {
      if (color) {
        this.colorValues = color.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.uom$.subscribe(uom => {
      if (uom) {
        this.uomValues = uom.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.style$.subscribe(style => {
      if (style) {
        this.styleValues = style.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.driveLine$.subscribe(driveline => {
      if (driveline) {
        this.drivelineValues = driveline.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.engineType$.subscribe(engineType => {
      if (engineType) {
        this.engineTypeValues = engineType.map(a => {
          return {
            value: a.id,
            description: a.name
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

  filterColor(value: string) {
    this._callCenterService.loadColor(value);
  }

  filterStyle(value: string) {
    this._callCenterService.loadStyle(value);
  }

  filterDriveline(value: string) {
    this._callCenterService.loadDriveline(value);
  }

  filterEngineType(value: string) {
    this._callCenterService.loadEngineType(value);
  }

  filterUom(value: string) {
    this._callCenterService.loadUom(value);
  }

  private _subscribeToFgChange() {
    this.subscription.push(this.fg.controls['model'].valueChanges.subscribe(value => {
      this.styleValues = this.styleList.filter(f => f.model[0] === value).map(o => {
        return {
          value: o.id,
          description: o.name
        };
      });
    }));
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get secondaryInfoTabValid() {
    return this._callCenterService.secondaryInfoTabValid;
  }

  goNextTab() {
    this._callCenterService.goNextTab();
  }
}
