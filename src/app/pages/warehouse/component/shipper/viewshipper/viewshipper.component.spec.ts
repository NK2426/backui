import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewshipperComponent } from './viewshipper.component';

describe('ViewshipperComponent', () => {
  let component: ViewshipperComponent;
  let fixture: ComponentFixture<ViewshipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewshipperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewshipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
