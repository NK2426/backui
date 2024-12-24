import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfMovementComponent } from './shelf-movement.component';

describe('ShelfMovementComponent', () => {
  let component: ShelfMovementComponent;
  let fixture: ComponentFixture<ShelfMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
