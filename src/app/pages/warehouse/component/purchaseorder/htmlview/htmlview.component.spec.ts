import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlviewComponent } from './htmlview.component';

describe('ViewComponent', () => {
  let component: HtmlviewComponent;
  let fixture: ComponentFixture<HtmlviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
