import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEditReasonService {

  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
  });

  fgControl = '';

  constructor() { }

  resetFg() {
    const inputValues = {
      id: 0,
      name: ''
    };

    this.fg.patchValue(inputValues);
  }
}
