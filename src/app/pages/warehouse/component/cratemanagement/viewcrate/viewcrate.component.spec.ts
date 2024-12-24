import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcrateComponent } from './viewcrate.component';

describe('ViewcrateComponent', () => {
  let component: ViewcrateComponent;
  let fixture: ComponentFixture<ViewcrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcrateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewcrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
