import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductvariantsComponent } from './productvariants.component';

describe('ProductvariantsComponent', () => {
  let component: ProductvariantsComponent;
  let fixture: ComponentFixture<ProductvariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductvariantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductvariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
