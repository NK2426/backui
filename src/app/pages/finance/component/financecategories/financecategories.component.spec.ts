import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancecategoriesComponent } from './financecategories.component';

describe('FinancecategoriesComponent', () => {
  let component: FinancecategoriesComponent;
  let fixture: ComponentFixture<FinancecategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancecategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancecategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
