import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewThreeWayMatchingComponent } from './view-three-way-matching.component';

describe('ViewThreeWayMatchingComponent', () => {
  let component: ViewThreeWayMatchingComponent;
  let fixture: ComponentFixture<ViewThreeWayMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewThreeWayMatchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewThreeWayMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
