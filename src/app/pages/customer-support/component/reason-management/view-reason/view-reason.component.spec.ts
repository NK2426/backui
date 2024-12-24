import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReasonComponent } from './view-reason.component';

describe('ViewReasonComponent', () => {
  let component: ViewReasonComponent;
  let fixture: ComponentFixture<ViewReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
