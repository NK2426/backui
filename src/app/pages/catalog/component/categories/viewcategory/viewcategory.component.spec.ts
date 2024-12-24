import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcategoryComponent } from './viewcategory.component';

describe('ViewcategoryComponent', () => {
  let component: ViewcategoryComponent;
  let fixture: ComponentFixture<ViewcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewcategoryComponent]
    });
    fixture = TestBed.createComponent(ViewcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
