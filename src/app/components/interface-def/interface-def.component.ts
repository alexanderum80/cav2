import { EditCompanyComponent } from './../../shared/components/edit-company/edit-company.component';
import { EditCompanyService } from './../../shared/services/edit-company.service';
import { AddEditActionService } from './../../shared/services/add-edit-action.service';
import { AddEditReasonService } from './../../shared/services/add-edit-reason.service';
import { AddEditReasonComponent } from './../../shared/components/add-edit-reason/add-edit-reason.component';
import { AddEditActionComponent } from './../../shared/components/add-edit-action/add-edit-action.component';
import { Subscription } from 'rxjs';
import { ShowMoreComponent } from './../../shared/components/show-more/show-more.component';
import { ShowMoreService } from '../../shared/services/show-more.service';
import { ModalService } from '../../shared/services/modal.service';
import { wizardModel, opportunityModel, phoneCallModel, DEFAULT_RECORD_LIMIT } from '../../shared/models/odoo.model';
import { Router } from '@angular/router';
import { hybridNote, goodForSaleNote, towingNote, DEFAULT_LENGTH_DISTANCE_ID, DEFAULT_DISTANCE_UOM_TYPE } from '../../shared/models/interface-def.model';
import { CallCenterService } from '../../shared/services/call-center.service';
import { UserService } from '../../shared/services/user.service';
import { OdooService } from '../../shared/services/odoo.service';
import { FormGroupService } from '../../shared/services/form-group.service';
import { ISelectableList } from '../../shared/models/interface-def.model';
import { AfterViewInit, Component, OnInit, OnDestroy, getDebugNode, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import SweetAlert from 'sweetalert2';
import { isBoolean } from 'lodash';

@Component({
  selector: 'app-interface-def',
  templateUrl: './interface-def.component.html',
  styleUrls: ['./interface-def.component.scss'],
})
export class InterfaceDefComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  fg!: FormGroup;
  labelPosition: 'before' | 'after' = 'before';
  prices: any;
  actionsValues: ISelectableList[] = [];
  makeValues: ISelectableList[] = [];
  modelValues: ISelectableList[] = [];
  companyValues: ISelectableList[] = [];
  agentValues: ISelectableList[] = [];
  checksumValues: ISelectableList[] = [
    { value: 'pass', description: 'PASS' },
    { value: 'fail', description: 'FAIL' },
    { value: 'user', description: 'USER' }
  ];
  distanceUnitValues: ISelectableList[] = [];

  vehicleImage1URL: any;
  vehicleImage2URL: any;
  vehicleImage3URL: any;
  vehicleImage4URL: any;
  vehicleImage5URL: any;

  imageExpanded = 0;

  loading = true;
  loadingVin = false;
  saving = false;

  subscription: Subscription[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private _formGroupService: FormGroupService,
    private _callCenterService: CallCenterService,
    private _odooSvc: OdooService,
    private _userService: UserService,
    private _showMoreSvc: ShowMoreService,
    private _modalSvc: ModalService,
    private _router: Router,
    private _addEditReasonSvc: AddEditReasonService,
    private _addEditActionSvc: AddEditActionService,
    private _editCompanySvc: EditCompanyService
  ){
    _callCenterService.actions$.subscribe(actions => {
      if (actions) {
        this.actionsValues = actions.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
        this.actionsValues.push({
          value: -1,
          description: 'Create...'
        });
      }
    });

    _callCenterService.make$.subscribe(make => {
      if (make) {
        this.makeValues = make.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.makeValues.length === DEFAULT_RECORD_LIMIT) {
        this.makeValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.model$.subscribe(model => {
      if (model) {
        this.modelValues = model.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.modelValues.length === DEFAULT_RECORD_LIMIT) {
        this.modelValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.company$.subscribe(company => {
      if (company) {
        this.companyValues = company.map(o => {
          return {
            value: o.id,
            description: o.name
          };
        });
      }
      if (this.companyValues.length === DEFAULT_RECORD_LIMIT) {
        this.companyValues.push({
          value: 0,
          description: 'Find more...'
        });
      }
    });

    _callCenterService.agent$.subscribe(agent => {
      if (agent) {
        this.agentValues = agent.map(a => {
          return {
            value: a.id,
            description: a.name
          };
        });
      }
    });

    _callCenterService.uom$.subscribe(uom => {
      if (uom) {
        this.distanceUnitValues = uom.filter(f => f.category_id[0] === DEFAULT_LENGTH_DISTANCE_ID &&
                                            f.uom_type === DEFAULT_DISTANCE_UOM_TYPE)
        .map(a => {
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
  }

  ngAfterViewInit() {
    this.fg.controls['draftAgent'].setValue(this._userService.user.username);

    this.fg.controls['hybridNote'].setValue(hybridNote);
    this.fg.controls['goodForSaleNote'].setValue(goodForSaleNote);
    this.fg.controls['towingNote'].setValue(towingNote);

    const contact = this._callCenterService.suppliers.find(s => s.id === this.fg.controls['supplier'].value);
    if (contact) {
      this.fg.controls['contactName'].setValue(contact.display_name);
      this.fg.controls['mobile'].setValue(contact.mobile !== false ? contact.mobile : '');
    }

    setTimeout(() => {
      this._loadValuesFromDataBase();

      this._subscribeToFormChange();

      this._loadStorageSession();
    }, 1000);
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _loadStorageSession() {
    const session = sessionStorage.getItem('formGroup');
    if (session) {
      const _fgValues = JSON.parse(session);
      this.fg.patchValue(_fgValues);
    } else {
      this._loadDefaultConfiguration();
    }
  }

  private async _loadValuesFromDataBase() {
    // loading primary data
    await this._callCenterService.loadDefaultConfiguration();

    await this._callCenterService.loadActions();

    await this._callCenterService.loadSuppliers();

    await this._callCenterService.loadCompany();

    await this._callCenterService.loadMake();

    await this._callCenterService.loadHighCataCar();

    await this._callCenterService.loadGoodCar();

    await this._callCenterService.loadUom();

    this.loading = false;

    // loading secondary data
    this._callCenterService.loadVehicleMissingPart();

    this._callCenterService.loadAgents();

    this._callCenterService.loadColor();

    this._callCenterService.loadStyle();

    this._callCenterService.loadDriveline();

    this._callCenterService.loadEngineType();

    this._callCenterService.loadContact();

    this._callCenterService.loadPickupType();

    this._callCenterService.loadReason();

    this._callCenterService.loadFiscalPosition();

    this._callCenterService.loadSupplierCity();

    this._callCenterService.loadSupplierProvince();

    this._callCenterService.loadSupplierCountry();

    this._callCenterService.loadOwnerCity();

    this._callCenterService.loadOwnerProvince();

    this._callCenterService.loadOwnerCountry();

    this._callCenterService.loadDonorCity();

    this._callCenterService.loadDonorProvince();

    this._callCenterService.loadDonorCountry();

    this._callCenterService.loadTowingCity();

    this._callCenterService.loadTowingProvince();

    this._callCenterService.loadTowingCountry();

    this._callCenterService.loadTires();

    this._callCenterService.loadWheels();

    this._callCenterService.loadBrakes();

    this._callCenterService.loadLocation();

    this._callCenterService.loadPaymentMethod();

    this._callCenterService.loadLanguage();

    this._callCenterService.loadDonorLanguage();
  }

  private _loadDefaultConfiguration() {
    const inputValues = {
      freeDebt: this._callCenterService.defaultFreeOfDebt,
      grossWeight: this._callCenterService.defaultGrossWeight,
      uom: this._callCenterService.defaultGrossWeightUom,
    };

    this.fg.patchValue(inputValues);
  }

  filterActions(value: string) {
    this._callCenterService.loadActions(value);
  }

  filterCompany(value: string) {
    this._callCenterService.loadCompany(value);
  }

  filterMake(value: string) {
    this._callCenterService.loadMake(value);
  }

  filterModel(value: string) {
    this._callCenterService.loadModel(this.fg.get('make')?.value, value);
  }

  get isFormValid(): boolean {
    return this.fg?.valid || false;
  }

  get curbWeight() {
    // tslint:disable-next-line: max-line-length
    return this._callCenterService.curbWeight.find(f => f.brand[0] === this.fg.controls['make'].value && f.model[0] === this.fg.controls['model'].value);
  }

  private _subscribeToFormChange() {
    this.subscription.push(this.fg.valueChanges.subscribe(value => {
      const _fg = JSON.stringify(this.fg.value);
      sessionStorage.setItem('formGroup', _fg);
    }));

    this.subscription.push(this.fg.controls['action'].valueChanges.subscribe((value: any) => {
      if (value === -1) {
        this.fg.controls['action'].setValue(this.fg.value.action, { emitEvent: false });
        this._addEditActionSvc.resetFg();
        this._addEditActionSvc.fgControl = 'action';
        this._modalSvc.openModal(AddEditActionComponent);
      }
    }));

    this.subscription.push(this.fg.controls['company'].valueChanges.subscribe(value => {
      this._callCenterService.loadPickupType();
      this._callCenterService.loadFiscalPosition();

      if (value === 0) {
        this.fg.controls['company'].setValue('');
        this._odooSvc.searchValues('res.company', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'company';
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

    this.subscription.push(this.fg.controls['vin'].valueChanges.subscribe(value => {
      if (!value) {
        return;
      }

      this.loadingVin = true;

      let inputValue = {
        make: '',
        model: '',
        year: '',
        style: '',
        driveline: '',
        engineType: '',
        engineSize: '',
        bodyType: '',
        grossWeight: ''
      };
      this.fg.patchValue(inputValue);

      const args = [value];

      if (value !== '') {
        this._odooSvc.callMethod('vin.saved', 'decode', args).then(resp => {
          this.loadingVin = false;

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
            const data = resp.result;

            if (!isBoolean(data.make)) {
              inputValue = {
                make: data.make,
                model: data.model,
                year: data.year,
                style: data.model_style,
                driveline: data.driving_wheels,
                engineType: data.engine_type,
                engineSize: data.engine_size,
                bodyType: data.body_type,
                grossWeight: data.gvwr_high
              };

              this.fg.patchValue(inputValue);

              this._callCenterService.loadMake();
              this._callCenterService.loadModel(inputValue.make);
              this._callCenterService.loadColor();
              this._callCenterService.loadStyle();
              this._callCenterService.loadDriveline();
              this._callCenterService.loadEngineType();
            }
          }
        });
      } else {
        this.loadingVin = false;
      }
    }));

    this.subscription.push(this.fg.controls['make'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['make'].setValue('');
        this._odooSvc.searchValues('vin.brand', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'make';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      } else {
        this.fg.controls['model'].setValue('');
        this._callCenterService.loadModel(value);
      }
    }));

    this.subscription.push(this.fg.controls['model'].valueChanges.subscribe(value => {
      if (value === 0) {
        this.fg.controls['model'].setValue('');
        this._odooSvc.searchValues('vin.model', [], [], 0).then(res => {
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
            this._showMoreSvc.fgField = 'model';
            this._showMoreSvc.columns = [
              { name: 'Code', field: 'code' },
              { name: 'Name', field: 'name' },
            ];
            this._showMoreSvc.data = res.result.records;
            this._modalSvc.openModal(ShowMoreComponent);
          }
        });
      } else {
        this._callCenterService.loadCurbWeight();
      }
    }));

    this.subscription.push(this.fg.controls['haveOwnershipPaper'].valueChanges.subscribe(value => {
      this.fg.controls['powerAttorney'].setValue(false);
    }));

    this.subscription.push(this.fg.controls['freeDebt'].valueChanges.subscribe(value => {
      this._callCenterService.freeDebt = value;
    }));

    this.subscription.push(this.fg.controls['supplier'].valueChanges.subscribe(value => {
      const supplier = this._callCenterService.suppliers.find(s => s.id === value);

      if (supplier) {
        const args = [
          this.fg.get('model')?.value,
          this.fg.get('year')?.value,
          this.curbWeight?.curb_weight_uom[0] || '',
          this.fg.get('supplier')?.value
        ];

        this._odooSvc.callMethod('res.users',
            'property_product_pricelist_purchase.price_rule_get_model_year',
            args).then(res => {
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
                this.prices = res;
              }
            });
      }
    }));

    this.subscription.push(this.fg.controls['carBody'].valueChanges.subscribe(value => {
      this.fg.controls['vehicleAccidented'].setValue(false);
      this.fg.controls['haveKeys'].setValue(true);
    }));

    this.subscription.push(this.fg.controls['refusalReason'].valueChanges.subscribe(value => {
      if (value === -1) {
        this.fg.controls['refusalReason'].setValue(this.fg.value.refusalReason, { emitEvent: false });
        this._addEditReasonSvc.resetFg();
        this._addEditReasonSvc.fgControl = 'refusalReason';
        this._modalSvc.openModal(AddEditReasonComponent);
      }
    }));

    this.subscription.push(this.fg.controls['delayReason'].valueChanges.subscribe(value => {
      if (value === -1) {
        this.fg.controls['delayReason'].setValue(this.fg.value.delayReason, { emitEvent: false });
        this._addEditReasonSvc.resetFg();
        this._addEditReasonSvc.fgControl = 'delayReason';
        this._modalSvc.openModal(AddEditReasonComponent);
      }
    }));
  }

  importImage(file: any) {
    if (file.files.length === 0) {
      return;
    }

    const _files = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < file.files.length; i++) {
      _files.push(file.files[i]);
    }

    _files.map((element: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(element);

      reader.onload = (_event) => {
        if (!this.vehicleImage1URL) { this.vehicleImage1URL = reader.result; }
        else if (!this.vehicleImage2URL) { this.vehicleImage2URL = reader.result; }
        else if (!this.vehicleImage3URL) { this.vehicleImage3URL = reader.result; }
        else if (!this.vehicleImage4URL) { this.vehicleImage4URL = reader.result; }
        else if (!this.vehicleImage5URL) { this.vehicleImage5URL = reader.result; }
      };
    });
  }

  deleteImage(image: number) {
    switch (image) {
      case 1:
        this.vehicleImage1URL = '';
        break;
      case 2:
        this.vehicleImage2URL = '';
        break;
      case 3:
        this.vehicleImage3URL = '';
        break;
      case 4:
        this.vehicleImage4URL = '';
        break;
      case 5:
        this.vehicleImage5URL = '';
        break;
    }
  }

  get allImageLoaded(): boolean {
    return this.vehicleImage1URL && this.vehicleImage2URL && this.vehicleImage3URL && this.vehicleImage4URL && this.vehicleImage5URL;
  }

  get finalStatus() {
    return this.fg.controls['carBody'].value ? 'ESPECIAL' :
          // tslint:disable-next-line: max-line-length
          this.fg.controls['wheels'].value !== '1' ? 'NO WHEELS' : 'REGULAR';
  }

  get finalOffer() {
    const agentOffer = this.fg.get('agentOffer')?.value;
    const secondOffer = this.fg.get('secondOffer')?.value;

    return Number(secondOffer) === 0 ? agentOffer : secondOffer;
  }

  get costumerExpectation() {
    return this.fg.controls['costumerExpectation'].value;
  }

  get year() {
    return this.fg.controls['year'].value;
  }

  get goodCar() {
    return this._callCenterService.isGoodCar;
  }

  get mileageInRange() {
    const _goorForSale = this._callCenterService.goodCar.find(f =>
      f.make[0] === this.fg.controls['make'].value &&
      f.model[0] === this.fg.controls['model'].value &&
      f.year === Number(this.fg.controls['year'].value)
    );

    return _goorForSale && _goorForSale.mileage >= this.fg.controls['mileage'].value;
  }

  get highCata() {
    return this._callCenterService.highCataCar.filter(h =>
      h.make[0] === this.fg.controls['make'].value &&
      h.model[0] === this.fg.controls['model'].value &&
      h.min_year <= Number(this.fg.controls['year'].value) &&
      h.max_year >= Number(this.fg.controls['year'].value)
    ).length > 0;
  }

  get goodForSale() {
    return this._callCenterService.goodForSaleStatus;
  }

  get freeDebt(): boolean {
    return this._callCenterService.freeDebt;
  }

  get makeDescription() {
    return this._callCenterService.make.find(m => m.id === this.fg.controls['make'].value)?.name;
  }

  get modelDescription() {
    return this.modelValues.find(m => m.value === this.fg.controls['model'].value)?.description;
  }

  get carBody(): boolean {
    return this._callCenterService.haveCarBody;
  }

  get isAccidented(): boolean {
    return this._callCenterService.isAccidented;
  }

  get isDropOff(): boolean {
    return this._callCenterService.isDropOff;
  }

  get haveKeys(): boolean {
    return this._callCenterService.haveKeys;
  }

  get haveEngine(): boolean {
    return this._callCenterService.haveEngine;
  }

  get haveTransmission(): boolean {
    return this._callCenterService.haveTransmission;
  }

  get haveBattery(): boolean {
    return this._callCenterService.haveBattery;
  }

  get haveCatalyticConvertor(): boolean {
    return this._callCenterService.haveCatalyticConvertor;
  }

  get haveTires(): boolean {
    return this._callCenterService.haveTires;
  }

  get haveRims(): boolean {
    return this._callCenterService.haveRims;
  }

  get haveAC(): boolean {
    return this._callCenterService.haveAC;
  }

  get havePapers(): boolean {
    return this._callCenterService.havePapers;
  }

  get powerAttorney(): boolean {
    return this._callCenterService.powerAttorney;
  }

  get missingPartTabValid() {
    return this._callCenterService.missingPartTabValid;
  }

  get offerTabValid() {
    return this._callCenterService.offerTabValid;
  }

  get secondaryInfoTabValid() {
    return this._callCenterService.secondaryInfoTabValid;
  }

  get supplierTabValid() {
    return this._callCenterService.supplierTabValid;
  }

  getSelectedIndex() {
    return this._callCenterService.selectedTabIndex;
  }

  onTabChange(event: MatTabChangeEvent) {
    this._callCenterService.selectedTabIndex = event.index;
  }

  goNextTab() {
    this._callCenterService.goNextTab();
  }

  switchExpandImage(image = 0) {
    this.imageExpanded = image;
  }

  cancelCall() {
    this._formGroupService.resetFormGroup();
    this._router.navigateByUrl('');
  }

  async finishCall() {
    try {
      this.saving = true;

      this.saveData().then(wizardId => {
        if (wizardId !== 0) {
          this._odooSvc.callMethod(wizardModel, 'finish', [wizardId]).then(resp => {
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
              this._router.navigateByUrl('');
            }
            this.saving = false;
          });
        } else {
          this.saving = false;
        }
      });
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
      this.saving = false;
    }
  }

  async lostCall() {
    this.saving = true;

    this.saveData().then(wizardId => {
      if (wizardId !== 0) {
        const args = { lost_reason: this.fg.get('refusalReason')?.value };
        this._odooSvc.writeMethod(wizardModel, wizardId, args).then(resp => {
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
            this._router.navigateByUrl('');
          }
          this.saving = false;
        });
      } else {
        this.saving = false;
      }
    });
  }

  private async saveData(): Promise<number> {
    try {
      const opportunityId = await this._createOpportunity();
      const wizardId = await this._saveWizard(opportunityId);

      return new Promise<number>(resolve => {
        if (wizardId && wizardId !== 0) {
          this._writeWizard(wizardId).then(res => {
            if (res) {
              this._savePhoneCall(opportunityId).then(resp => {
                if (resp) {
                  resolve(wizardId);
                } else {
                  resolve(0);
                }
              });
            } else {
              resolve(0);
            }
          });
        } else {
          resolve(0);
        }
      });
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
      return 0;
    }
  }

  private async _saveWizard(opportunity: number): Promise<number> {
    const wizardArgs = {
      date: new Date(),
      opportunity: opportunity,
      draft_agent: this._userService.user.uid
    };
    return new Promise<number>(resolve => {
      this._odooSvc.createMethod(wizardModel, wizardArgs).then(res => {
        if (res.error) {
          console.log(res.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: res.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
          resolve(0);
        } else {
          resolve(res.result);
        }
      }).catch(err => {
        console.log(err);
        resolve(0);
      });
    });
  }

  private async _createOpportunity(): Promise<number> {
    const opportunityArgs = await this._callCenterService.getNewOpportunity();
    return new Promise<number>(resolve => {
      this._odooSvc.createMethod(opportunityModel, opportunityArgs).then(res => {
        if (res.error) {
          console.log(res.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: res.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
          resolve(0);
        } else {
          resolve(res.result);
        }
      }).catch(err => {
        console.log(err);
        resolve(0);
      });
    });
  }

  private async _writeWizard(wizardId: number): Promise<boolean> {
    const opportunityArgs = await this._callCenterService.getWriteOpportunity();
    return new Promise<boolean>(resolve => {
      this._odooSvc.writeMethod(wizardModel, wizardId, opportunityArgs).then(resp => {
        if (resp.error) {
          console.log(resp.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: resp.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch(err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  private async _savePhoneCall(oppId: number): Promise<boolean> {
    const phoneCallArgs = this._callCenterService.getPhoneCall();
    phoneCallArgs.purchase_opportunity = oppId;
    return new Promise<boolean>(resolve => {
      this._odooSvc.createMethod(phoneCallModel, phoneCallArgs).then(res => {
        if (res.error) {
          console.log(res.error.data);
          SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: res.error.data.message,
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch(err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  editCompany(idCompany: number | string) {
    const domain = [['id', '=', idCompany]];
    this._odooSvc.searchValues('res.company', domain).then(res => {
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
        const company = res.result.records[0];
        const payload = {
          id: company.id,
          code: company.code,
          name: company.name,
          street: company.street,
          city: company.city,
          state: company.state_id[0],
          zip: company.zip,
          country: company.country_id[0],
          rmlHeader1: company.rml_header1,
          website: company.website,
          phone: company.phone,
          fax: company.fax,
          email: company.email,
          vat: company.vat,
          companyRegistry: company.company_registry,
        };

        this._editCompanySvc.fg.patchValue(payload);
        this._modalSvc.openModal(EditCompanyComponent);
      }
    });
  }

  editAction(idAction: number | string) {
    const domain = [['id', '=', idAction]];
    this._odooSvc.searchValues('crm.phonecall.action', domain).then(res => {
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
        const payload = {
          id: action.id,
          name: action.name,
          programType: action.charity_program_type,
          isKidney: action.is_kidney,
          isCharity: action.is_charity,
          mandatoryNote: action.is_mandatory_note,
          allowCreateOpp: action.allow_create_an_opp,
          notes: action.notes,
          active: action.active,
        };
        this._addEditActionSvc.fg.patchValue(payload);
        this._modalSvc.openModal(AddEditActionComponent);
      }
    });
  }

}
