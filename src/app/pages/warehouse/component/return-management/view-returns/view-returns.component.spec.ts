import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReturnsComponent } from './view-returns.component';

describe('ViewReturnsComponent', () => {
  let component: ViewReturnsComponent;
  let fixture: ComponentFixture<ViewReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
