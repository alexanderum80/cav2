import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEditSupplierService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    purchaseCategory: new FormControl(''),
    street: new FormControl(''),
    street2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    country: new FormControl(''),
    website: new FormControl(''),
    function: new FormControl(''),
    phone: new FormControl(''),
    mobile: new FormControl(''),
    fax: new FormControl(''),
    email: new FormControl(''),
    title: new FormControl(''),
  });

  fgControl = '';

  constructor() { }

  resetFg() {
    const inputValues =  {
      id: 0,
      name: '',
      purchaseCategory: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      website: '',
      function: '',
      phone: '',
      mobile: '',
      fax: '',
      email: '',
      title: '',
    };

    this.fg.patchValue(inputValues);
  }
}
