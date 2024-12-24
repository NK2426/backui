import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCategoryComponent } from './finance-category.component';

describe('FinanceCategoryComponent', () => {
  let component: FinanceCategoryComponent;
  let fixture: ComponentFixture<FinanceCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceCategoryComponent]
    });
    fixture = TestBed.createComponent(FinanceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
