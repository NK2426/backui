import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleInwardComponent } from './bundle-inward.component';

describe('BundleInwardComponent', () => {
  let component: BundleInwardComponent;
  let fixture: ComponentFixture<BundleInwardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundleInwardComponent]
    });
    fixture = TestBed.createComponent(BundleInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
