import { TextareaComponent } from './angular-material/textarea/textarea.component';
import { ModalComponent } from './angular-material/modal/modal.component';
import { ShowMoreService } from './shared/services/show-more.service';
import { TableModule } from './angular-material/table/table.module';
import { InputComponent } from './angular-material/input/input.component';
import { RadioButtonModule } from './angular-material/radio-button/radio-button.module';
import { ModalService } from './shared/services/modal.service';
import { CallCenterService } from './shared/services/call-center.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { OdooService } from './shared/services/odoo.service';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { UserService } from './shared/services/user.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { FormGroupService } from './shared/services/form-group.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InterfaceDefComponent } from './components/interface-def/interface-def.component';
import { MissingPartsComponent } from './components/missing-parts/missing-parts.component';

/// imports Material Components
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxDefaultOptions, MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { VehicleSecondaryInfoComponent } from './components/vehicle-secondary-info/vehicle-secondary-info.component';
import { SupplierAndOwnerComponent } from './components/supplier-and-owner/supplier-and-owner.component';
import { OfferComponent } from './components/offer/offer.component';
import { TowingAndRecapComponent } from './components/towing-and-recap/towing-and-recap.component';
import { HttpClientModule } from '@angular/common/http';
import { Session } from './shared/models/session';
import { CheckboxComponent } from './angular-material/checkbox/checkbox.component';
import { CallsComponent } from './components/calls/calls.component';
import { NewCallComponent } from './components/new-call/new-call.component';
import { SelectComponent } from './angular-material/select/select.component';
import { SpinnerComponent } from './angular-material/spinner/spinner.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { AddEditActionComponent } from './shared/components/add-edit-action/add-edit-action.component';
import { ShowMoreComponent } from './shared/components/show-more/show-more.component';
import { AddEditReasonComponent } from './shared/components/add-edit-reason/add-edit-reason.component';
import { EditCompanyComponent } from './shared/components/edit-company/edit-company.component';
import { AddEditSupplierComponent } from './shared/components/add-edit-supplier/add-edit-supplier.component';
import { AddEditAgentComponent } from './shared/components/add-edit-agent/add-edit-agent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InterfaceDefComponent,
    MissingPartsComponent,
    VehicleSecondaryInfoComponent,
    SupplierAndOwnerComponent,
    OfferComponent,
    TowingAndRecapComponent,
    // Angular material components
    CheckboxComponent,
    CallsComponent,
    NewCallComponent,
    InputComponent,
    SelectComponent,
    SpinnerComponent,
    TextareaComponent,
    AddEditActionComponent,
    ModalComponent,
    ShowMoreComponent,
    AddEditReasonComponent,
    EditCompanyComponent,
    AddEditSupplierComponent,
    AddEditAgentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IvyCarouselModule,
    RadioButtonModule,
    TableModule,
    /// imports Material modules
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [FormGroupService, AuthGuard, AuthenticationService, UserService, OdooService, SessionStorageService,
    CallCenterService, ModalService, ShowMoreService,
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate' } as MatCheckboxDefaultOptions }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private _sessinStorageSrv: SessionStorageService,
    private _authService: AuthenticationService
  ) {
    this._getAuthMiddleWare();
  }

  private _getAuthMiddleWare() {
    const session: Session = this._sessinStorageSrv.userToken;
    if (!isNaN(session.uid)) {
      this._authService.authenticate(true, session);
    }
  }
}
