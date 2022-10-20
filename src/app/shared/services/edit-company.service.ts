import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditCompanyService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    code: new FormControl(''),
    name: new FormControl(''),
    street: new FormControl(''),
    street2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    country: new FormControl(''),
    rmlHeader1: new FormControl(''),
    website: new FormControl(''),
    phone: new FormControl(''),
    fax: new FormControl(''),
    email: new FormControl(''),
    vat: new FormControl(''),
    companyRegistry: new FormControl(''),
  });

  fgControl = '';

  constructor() { }

  resetFg() {
    const inputValues =  {
      id: 0,
      code: '',
      name: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      rmlHeader1: '',
      website: '',
      phone: '',
      fax: '',
      email: '',
      vat: '',
      companyRegistry: '',
    };

    this.fg.patchValue(inputValues);
  }
}
