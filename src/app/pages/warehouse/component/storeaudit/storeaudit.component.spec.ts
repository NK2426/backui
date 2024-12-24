import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreauditComponent } from './storeaudit.component';

describe('StoreauditComponent', () => {
  let component: StoreauditComponent;
  let fixture: ComponentFixture<StoreauditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreauditComponent]
    });
    fixture = TestBed.createComponent(StoreauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
