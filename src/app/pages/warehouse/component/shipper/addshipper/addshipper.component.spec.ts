import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddshipperComponent } from './addshipper.component';

describe('AddshipperComponent', () => {
  let component: AddshipperComponent;
  let fixture: ComponentFixture<AddshipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddshipperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddshipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
