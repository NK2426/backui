import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTypeDetailComponent } from './ticket-type-detail.component';

describe('TicketTypeDetailComponent', () => {
  let component: TicketTypeDetailComponent;
  let fixture: ComponentFixture<TicketTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketTypeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
