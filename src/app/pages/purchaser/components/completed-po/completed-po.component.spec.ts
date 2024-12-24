import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedPoComponent } from './completed-po.component';

describe('CompletedPoComponent', () => {
  let component: CompletedPoComponent;
  let fixture: ComponentFixture<CompletedPoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedPoComponent]
    });
    fixture = TestBed.createComponent(CompletedPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
