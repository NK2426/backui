import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddshelfComponent } from './addshelf.component';

describe('AddshelfComponent', () => {
  let component: AddshelfComponent;
  let fixture: ComponentFixture<AddshelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddshelfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddshelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
