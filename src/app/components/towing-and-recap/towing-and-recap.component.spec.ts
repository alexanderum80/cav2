import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingAndRecapComponent } from './towing-and-recap.component';

describe('TowingAndRecapComponent', () => {
  let component: TowingAndRecapComponent;
  let fixture: ComponentFixture<TowingAndRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowingAndRecapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TowingAndRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
