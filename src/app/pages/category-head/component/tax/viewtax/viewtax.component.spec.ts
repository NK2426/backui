import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtaxComponent } from './viewtax.component';

describe('ViewtaxComponent', () => {
  let component: ViewtaxComponent;
  let fixture: ComponentFixture<ViewtaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewtaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
