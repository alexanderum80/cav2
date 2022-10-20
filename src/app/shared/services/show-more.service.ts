import { MaterialTableColumns } from '../models/mat-table.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowMoreService {
  private _title = new BehaviorSubject('');
  private _fgField = '';
  private _data = new BehaviorSubject([]);
  private _columns = new BehaviorSubject<MaterialTableColumns[]>([{ name: '', field: '' }]);

  constructor() { }

  get fgField() {
    return this._fgField;
  }

  set fgField(fgField: any) {
    this._fgField = fgField;
  }

  get title$() {
    return this._title.asObservable();
  }

  get title() {
    return this._title.value;
  }

  set title(title: any) {
    this._title.next(title);
  }

  get data$() {
    return this._data.asObservable();
  }

  get data() {
    return this._data.value;
  }

  set data(data: any) {
    this._data.next(data);
  }

  get columns$() {
    return this._columns.asObservable();
  }

  get columns(): MaterialTableColumns[] {
    return this._columns.value;
  }

  set columns(columns: MaterialTableColumns[]) {
    this._columns.next(columns);
  }
}
