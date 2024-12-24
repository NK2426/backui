import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesettingComponent } from './homesetting.component';

describe('HomesettingComponent', () => {
  let component: HomesettingComponent;
  let fixture: ComponentFixture<HomesettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomesettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomesettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
