import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddqcstockComponent } from './addqcstock.component';

describe('AddqcstockComponent', () => {
  let component: AddqcstockComponent;
  let fixture: ComponentFixture<AddqcstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddqcstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddqcstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
