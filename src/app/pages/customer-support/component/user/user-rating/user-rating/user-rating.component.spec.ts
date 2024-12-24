import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRatingComponent } from './user-rating.component';

describe('UserRatingComponent', () => {
  let component: UserRatingComponent;
  let fixture: ComponentFixture<UserRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
