import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkulevelOrdersPoComponent } from './skulevel-orders-po.component';

describe('SkulevelOrdersPoComponent', () => {
  let component: SkulevelOrdersPoComponent;
  let fixture: ComponentFixture<SkulevelOrdersPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkulevelOrdersPoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkulevelOrdersPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
