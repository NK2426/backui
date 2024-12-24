import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddparametersComponent } from './addparameters.component';

describe('AddparametersComponent', () => {
  let component: AddparametersComponent;
  let fixture: ComponentFixture<AddparametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddparametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddparametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
