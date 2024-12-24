import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardgrnforqcComponent } from './inwardgrnforqc.component';

describe('InwardpoComponent', () => {
  let component: InwardgrnforqcComponent;
  let fixture: ComponentFixture<InwardgrnforqcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardgrnforqcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InwardgrnforqcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
