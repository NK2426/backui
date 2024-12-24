import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbankaccountComponent } from './addbankaccount.component';

describe('AddbankaccountComponent', () => {
  let component: AddbankaccountComponent;
  let fixture: ComponentFixture<AddbankaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbankaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
