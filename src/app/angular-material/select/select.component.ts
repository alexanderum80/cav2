import { ISelectableList } from '../../shared/models/interface-def.model';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, ChangeDetectionStrategy, AfterContentChecked } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit, AfterContentChecked {
  @Input() public label!: string;
  @Input() public fg!: FormGroup;
  @Input() public control!: string;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public canEdit = false;
  @Input() set values(v: any) {
    this.originalValues = v;
    this.selectionValues = v;
  }

  @Output() searchValue = new EventEmitter<string>();
  @Output() editElement = new EventEmitter<string | number>();

  originalValues!: ISelectableList[];
  selectionValues!: ISelectableList[];
  timing: any;

  // updateDate!: Date;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  get hasControlValue(): boolean {
    return this.fg.get(this.control)?.value !== '' || false;
  }

  search(event: any) {
    clearTimeout(this.timing);
    this.timing = setTimeout(() => {
      const value = event.target.value;
      this.searchValue.emit(value || '');
    }, 500);
  }

  onClear(event: Event) {
    this.fg.controls[this.control].setValue('');
    event.stopPropagation();
  }

  onEdit(event: Event) {
    this.editElement.emit(this.fg.get(this.control)?.value);
    event.stopPropagation();
  }

}
