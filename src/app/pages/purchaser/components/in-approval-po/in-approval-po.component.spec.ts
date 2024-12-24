import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InApprovalPoComponent } from './in-approval-po.component';

describe('InApprovalPoComponent', () => {
  let component: InApprovalPoComponent;
  let fixture: ComponentFixture<InApprovalPoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InApprovalPoComponent]
    });
    fixture = TestBed.createComponent(InApprovalPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
