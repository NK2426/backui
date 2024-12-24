import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductvariantsComponent } from './view-productvariants.component';

describe('ViewProductvariantsComponent', () => {
  let component: ViewProductvariantsComponent;
  let fixture: ComponentFixture<ViewProductvariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductvariantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductvariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
