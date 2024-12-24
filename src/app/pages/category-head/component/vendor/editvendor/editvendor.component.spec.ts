import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditvendorComponent } from './editvendor.component';

describe('EditvendorComponent', () => {
  let component: EditvendorComponent;
  let fixture: ComponentFixture<EditvendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditvendorComponent]
    });
    fixture = TestBed.createComponent(EditvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
