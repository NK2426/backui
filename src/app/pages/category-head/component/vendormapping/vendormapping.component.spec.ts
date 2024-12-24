import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormappingComponent } from './vendormapping.component';

describe('VendormappingComponent', () => {
  let component: VendormappingComponent;
  let fixture: ComponentFixture<VendormappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendormappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendormappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
