import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensetypesComponent } from './expensetypes.component';

describe('ExpensetypesComponent', () => {
  let component: ExpensetypesComponent;
  let fixture: ComponentFixture<ExpensetypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensetypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
