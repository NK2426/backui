import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbankaccountComponent } from './viewbankaccount.component';

describe('ViewbankaccountComponent', () => {
  let component: ViewbankaccountComponent;
  let fixture: ComponentFixture<ViewbankaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbankaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
