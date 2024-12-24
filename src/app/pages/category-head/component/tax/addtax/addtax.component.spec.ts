import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaxComponent } from './addtax.component';

describe('AddtaxComponent', () => {
  let component: AddtaxComponent;
  let fixture: ComponentFixture<AddtaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
