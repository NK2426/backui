import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodinTransitComponent } from './goodin-transit.component';

describe('GoodinTransitComponent', () => {
  let component: GoodinTransitComponent;
  let fixture: ComponentFixture<GoodinTransitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoodinTransitComponent]
    });
    fixture = TestBed.createComponent(GoodinTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
