import { FormGroup } from '@angular/forms';
import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from '../../shared/models/material-error-state-matcher';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit, AfterContentChecked {
  @Input() public type = 'text';
  @Input() public label!: string;
  @Input() public fg!: FormGroup;
  @Input() public control!: string;
  @Input() public placeholder!: string;
  @Input() public required = false;
  @Input() public autocomplete: 'off' | 'on' = 'on';
  @Input() public mask = '';
  @Input() public showMask = false;
  @Input() public readonly = false;
  @Input() public suffix = '';
  @Input() set disabled(d: boolean) {
    d ? this.fg.get(this.control)?.disable() : this.fg.get(this.control)?.enable();
  }

  matcher = new MyErrorStateMatcher();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

}
