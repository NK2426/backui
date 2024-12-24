import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewwebpagesettingComponent } from './newwebpagesetting.component';

describe('NewwebpagesettingComponent', () => {
  let component: NewwebpagesettingComponent;
  let fixture: ComponentFixture<NewwebpagesettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewwebpagesettingComponent]
    });
    fixture = TestBed.createComponent(NewwebpagesettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
