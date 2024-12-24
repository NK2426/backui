import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTagComponent } from './all-tag.component';

describe('AllTagComponent', () => {
  let component: AllTagComponent;
  let fixture: ComponentFixture<AllTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
