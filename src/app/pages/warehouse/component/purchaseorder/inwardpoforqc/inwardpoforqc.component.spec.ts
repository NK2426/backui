import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardpoComponent } from './inwardpoforqc.component';

describe('InwardpoComponent', () => {
  let component: InwardpoComponent;
  let fixture: ComponentFixture<InwardpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InwardpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
