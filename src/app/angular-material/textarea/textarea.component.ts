import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterContentChecked } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements OnInit, AfterContentChecked {
  @Input() public label!: string;
  @Input() public fg!: FormGroup;
  @Input() public control!: string;
  @Input() public placeholder!: string;
  @Input() public required = false;
  @Input() public readonly = false;
  @Input() set disabled(d: boolean) {
    d ? this.fg.get(this.control)?.disable() : this.fg.get(this.control)?.enable();
  }
  @Input() public rows = 1;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

}
