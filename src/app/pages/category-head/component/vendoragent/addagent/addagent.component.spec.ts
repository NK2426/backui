import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddagentComponent } from './addagent.component';

describe('AddagentComponent', () => {
  let component: AddagentComponent;
  let fixture: ComponentFixture<AddagentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddagentComponent]
    });
    fixture = TestBed.createComponent(AddagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
