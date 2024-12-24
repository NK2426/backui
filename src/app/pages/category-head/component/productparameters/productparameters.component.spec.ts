import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductparametersComponent } from './productparameters.component';

describe('ProductparametersComponent', () => {
  let component: ProductparametersComponent;
  let fixture: ComponentFixture<ProductparametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductparametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductparametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
