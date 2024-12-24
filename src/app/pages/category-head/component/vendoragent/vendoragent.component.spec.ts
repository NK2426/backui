import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoragentComponent } from './vendoragent.component';

describe('VendoragentComponent', () => {
  let component: VendoragentComponent;
  let fixture: ComponentFixture<VendoragentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendoragentComponent]
    });
    fixture = TestBed.createComponent(VendoragentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
