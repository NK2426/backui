import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpensetypesComponent } from './view-expensetypes.component';

describe('ViewBrandsComponent', () => {
  let component: ViewExpensetypesComponent;
  let fixture: ComponentFixture<ViewExpensetypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpensetypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpensetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
