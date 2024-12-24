import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleviewComponent } from './bundleview.component';

describe('BundleviewComponent', () => {
  let component: BundleviewComponent;
  let fixture: ComponentFixture<BundleviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BundleviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
