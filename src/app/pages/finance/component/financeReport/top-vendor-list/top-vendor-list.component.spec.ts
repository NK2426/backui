import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopVendorListComponent } from './top-vendor-list.component';

describe('TopVendorListComponent', () => {
  let component: TopVendorListComponent;
  let fixture: ComponentFixture<TopVendorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopVendorListComponent]
    });
    fixture = TestBed.createComponent(TopVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
