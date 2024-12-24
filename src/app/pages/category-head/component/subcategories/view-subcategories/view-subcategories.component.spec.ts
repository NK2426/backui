import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubcategoriesComponent } from './view-subcategories.component';

describe('ViewSubcategoriesComponent', () => {
  let component: ViewSubcategoriesComponent;
  let fixture: ComponentFixture<ViewSubcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubcategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
