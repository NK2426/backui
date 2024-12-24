import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReturnDetailComponent } from './view-return-detail.component';

describe('ViewReturnDetailComponent', () => {
  let component: ViewReturnDetailComponent;
  let fixture: ComponentFixture<ViewReturnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReturnDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReturnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
