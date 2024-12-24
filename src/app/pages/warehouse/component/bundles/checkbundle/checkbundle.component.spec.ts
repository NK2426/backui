import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckbundleComponent } from './checkbundle.component';

describe('CheckbundleComponent', () => {
  let component: CheckbundleComponent;
  let fixture: ComponentFixture<CheckbundleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckbundleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckbundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
