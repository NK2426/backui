import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProductListComponent } from './top-product-list.component';

describe('TopProductListComponent', () => {
  let component: TopProductListComponent;
  let fixture: ComponentFixture<TopProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopProductListComponent]
    });
    fixture = TestBed.createComponent(TopProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
