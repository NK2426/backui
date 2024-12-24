import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleqcstockComponent } from './singleqcstock.component';

describe('SingleqcstockComponent', () => {
  let component: SingleqcstockComponent;
  let fixture: ComponentFixture<SingleqcstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleqcstockComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleqcstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
