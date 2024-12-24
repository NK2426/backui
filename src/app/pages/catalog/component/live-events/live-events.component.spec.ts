import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveEventComponent } from './live-events.component';

describe('LiveEventComponent', () => {
  let component: LiveEventComponent;
  let fixture: ComponentFixture<LiveEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveEventComponent]
    });
    fixture = TestBed.createComponent(LiveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
