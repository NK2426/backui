import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReasonComponent } from './all-reason.component';

describe('AllReasonComponent', () => {
  let component: AllReasonComponent;
  let fixture: ComponentFixture<AllReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
