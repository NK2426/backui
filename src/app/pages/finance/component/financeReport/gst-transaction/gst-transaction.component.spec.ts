import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstTransactionComponent } from './gst-transaction.component';

describe('GstTransactionComponent', () => {
  let component: GstTransactionComponent;
  let fixture: ComponentFixture<GstTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstTransactionComponent]
    });
    fixture = TestBed.createComponent(GstTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
