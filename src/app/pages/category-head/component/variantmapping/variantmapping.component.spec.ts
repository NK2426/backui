import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantmappingComponent } from './variantmapping.component';

describe('VariantmappingComponent', () => {
  let component: VariantmappingComponent;
  let fixture: ComponentFixture<VariantmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantmappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
