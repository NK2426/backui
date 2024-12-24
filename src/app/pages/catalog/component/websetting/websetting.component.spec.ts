import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsettingComponent } from './websetting.component';

describe('WebsettingComponent', () => {
  let component: WebsettingComponent;
  let fixture: ComponentFixture<WebsettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsettingComponent]
    });
    fixture = TestBed.createComponent(WebsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
