import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoComponent } from './po.component';

describe('PoComponent', () => {
  let component: PoComponent;
  let fixture: ComponentFixture<PoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoComponent]
    });
    fixture = TestBed.createComponent(PoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
