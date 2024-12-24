import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNotesViewComponent } from './debit-notes-view.component';

describe('DebitNotesViewComponent', () => {
  let component: DebitNotesViewComponent;
  let fixture: ComponentFixture<DebitNotesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNotesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNotesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
