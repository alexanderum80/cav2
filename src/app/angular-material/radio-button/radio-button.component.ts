import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroup } from '@angular/forms';
import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ThemePalette  } from '@angular/material/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent implements OnInit, AfterContentChecked {
  @Input() label!: string;
  @Input() fg!: FormGroup;
  @Input() control!: string;
  @Input() buttonValues: ISelectableList[] = [];
  @Input() orientation = 'row';
  @Input() color: ThemePalette = 'primary';
  @Input() required = false;
  @Input() disabled = false;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

}
