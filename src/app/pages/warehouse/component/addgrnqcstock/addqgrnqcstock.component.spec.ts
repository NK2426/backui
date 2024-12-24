import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgrnqcstockComponent } from './addqgrnqcstock.component';

describe('AddqcstockComponent', () => {
  let component: AddgrnqcstockComponent;
  let fixture: ComponentFixture<AddgrnqcstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddgrnqcstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgrnqcstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
