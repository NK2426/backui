import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewstoreComponent } from './viewstore.component';

describe('ViewstoreComponent', () => {
  let component: ViewstoreComponent;
  let fixture: ComponentFixture<ViewstoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewstoreComponent]
    });
    fixture = TestBed.createComponent(ViewstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
