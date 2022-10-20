import { FormGroup } from '@angular/forms';
import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnInit, AfterContentChecked {
  @Input() fg!: FormGroup;
  @Input() control!: string;
  @Input() label!: string;
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() disabled = false;
  @Input() required = false;
  @Input() color = 'primary';

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

}
