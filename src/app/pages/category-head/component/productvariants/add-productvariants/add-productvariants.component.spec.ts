import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductvariantsComponent } from './add-productvariants.component';

describe('AddProductvariantsComponent', () => {
  let component: AddProductvariantsComponent;
  let fixture: ComponentFixture<AddProductvariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductvariantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductvariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
