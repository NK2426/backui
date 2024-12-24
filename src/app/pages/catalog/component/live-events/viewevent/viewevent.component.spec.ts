import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweventComponent } from './viewevent.component';

describe('VieweventComponent', () => {
  let component: VieweventComponent;
  let fixture: ComponentFixture<VieweventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VieweventComponent]
    });
    fixture = TestBed.createComponent(VieweventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
