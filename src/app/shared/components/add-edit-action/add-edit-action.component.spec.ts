import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditActionComponent } from './add-edit-action.component';

describe('AddEditActionComponent', () => {
  let component: AddEditActionComponent;
  let fixture: ComponentFixture<AddEditActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
