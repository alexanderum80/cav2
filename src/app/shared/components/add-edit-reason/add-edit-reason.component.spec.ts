import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReasonComponent } from './add-edit-reason.component';

describe('AddEditReasonComponent', () => {
  let component: AddEditReasonComponent;
  let fixture: ComponentFixture<AddEditReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
