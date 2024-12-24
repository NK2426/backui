import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesreportComponent } from './view-salesreport.component';

describe('ViewSalesreportComponent', () => {
  let component: ViewSalesreportComponent;
  let fixture: ComponentFixture<ViewSalesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalesreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
