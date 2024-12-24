import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewexpenseComponent } from './viewexpense.component';

describe('ViewexpenseComponent', () => {
  let component: ViewexpenseComponent;
  let fixture: ComponentFixture<ViewexpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewexpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
