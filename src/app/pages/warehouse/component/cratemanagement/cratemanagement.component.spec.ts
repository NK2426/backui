import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CratemanagementComponent } from './cratemanagement.component';

describe('CratemanagementComponent', () => {
  let component: CratemanagementComponent;
  let fixture: ComponentFixture<CratemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CratemanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CratemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
