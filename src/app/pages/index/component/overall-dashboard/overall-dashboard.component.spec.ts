import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallDashboardComponent } from './overall-dashboard.component';

describe('OverallDashboardComponent', () => {
  let component: OverallDashboardComponent;
  let fixture: ComponentFixture<OverallDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverallDashboardComponent]
    });
    fixture = TestBed.createComponent(OverallDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
