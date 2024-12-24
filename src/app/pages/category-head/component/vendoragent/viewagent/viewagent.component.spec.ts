import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewagentComponent } from './viewagent.component';

describe('ViewagentComponent', () => {
  let component: ViewagentComponent;
  let fixture: ComponentFixture<ViewagentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewagentComponent]
    });
    fixture = TestBed.createComponent(ViewagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
