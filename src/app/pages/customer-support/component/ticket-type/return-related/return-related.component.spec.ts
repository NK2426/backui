import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRelatedComponent } from './return-related.component';

describe('ReturnRelatedComponent', () => {
  let component: ReturnRelatedComponent;
  let fixture: ComponentFixture<ReturnRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRelatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
