import { FormGroup } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef, ChangeDetectionStrategy, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterContentChecked {
  @Input() title: any;
  @Input() fg!: FormGroup;
  @Input() showActions = true;
  @Output() saveClicked = new EventEmitter<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    private _modalSvc: ModalService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  save(): void {
    this.saveClicked.emit(true);
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

  isFormValid(): boolean {
    return this.fg?.valid || false;
  }

}
