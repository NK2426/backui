import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpensetypesComponent } from './add-expensetypes.component';

describe('AddBrandsComponent', () => {
  let component: AddExpensetypesComponent;
  let fixture: ComponentFixture<AddExpensetypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpensetypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpensetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
