import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewvendorComponent } from './viewvendor.component';

describe('ViewvendorComponent', () => {
  let component: ViewvendorComponent;
  let fixture: ComponentFixture<ViewvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewvendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
