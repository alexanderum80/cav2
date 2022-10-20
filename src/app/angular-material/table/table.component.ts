import { MaterialTableColumns } from '../../shared/models/mat-table.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnChanges, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('inputFilter') inputFilter!: ElementRef;

  @Input() columns: MaterialTableColumns[] = [];
  @Input() data: any[] = [];
  @Input() filter = true;

  // @Output() clickAction = new EventEmitter();
  @Output() selectedRow = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();

  loading = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.displayedColumns = this.columns.map(c => {
      return c.field;
    });

    if (this.data) {
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    this.applyFilter();
  }

  getDisplayedColumns(): any[] {
    return this.displayedColumns.filter(f => f !== 'MENU') || [];
  }

  getFieldName(field: string): string {
    return this.columns.find(f => f.field === field)?.name || '';
  }

  getData(row: any, column: any): any {
    return row[column];
  }

  // onClicked(action: any, element: any): void {
  //   const outPutValues = {
  //     action,
  //     element
  //   };

  //   this.clickAction.emit(outPutValues);
  // }

  applyFilter(): void {
    const filterValue = this.inputFilter?.nativeElement.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  select(row: any) {
    this.selectedRow.emit(row);
  }

}
