import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPoListComponent } from './new-po-list.component';

describe('NewPoListComponent', () => {
  let component: NewPoListComponent;
  let fixture: ComponentFixture<NewPoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPoListComponent]
    });
    fixture = TestBed.createComponent(NewPoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
