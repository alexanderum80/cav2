import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEditActionService {

  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    programType: new FormControl(''),
    isKidney: new FormControl(false),
    isCharity: new FormControl(false),
    defaultContact: new FormControl(''),
    mandatoryNote: new FormControl(false),
    allowCreateOpp: new FormControl(false),
    notes: new FormControl(''),
    active: new FormControl(true),
  });

  fgControl = '';

  constructor() { }

  resetFg() {
    const inputValues =  {
      id: 0,
      name: '',
      programType: '',
      isKidney: false,
      isCharity: false,
      defaultContact: '',
      mandatoryNote: false,
      allowCreateOpp: false,
      notes: '',
      active: true,
    };

    this.fg.patchValue(inputValues);
  }
}
