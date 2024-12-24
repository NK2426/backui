import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocalComponent } from './videocal.component';

describe('VideocalComponent', () => {
  let component: VideocalComponent;
  let fixture: ComponentFixture<VideocalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideocalComponent]
    });
    fixture = TestBed.createComponent(VideocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
