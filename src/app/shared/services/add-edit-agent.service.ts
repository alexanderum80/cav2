import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEditAgentService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    login: new FormControl(''),
    email: new FormControl(''),
    language: new FormControl(''),
    active: new FormControl(true),
  });

  fgControl = '';

  constructor() { }

  resetFg() {
    const inputValues =  {
      id: 0,
      name: '',
      login: '',
      email: '',
      language: '',
      active: true,
    };

    this.fg.patchValue(inputValues);
  }

}
