import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashListComponent } from './trash-list.component';

describe('TrashListComponent', () => {
  let component: TrashListComponent;
  let fixture: ComponentFixture<TrashListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrashListComponent]
    });
    fixture = TestBed.createComponent(TrashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
