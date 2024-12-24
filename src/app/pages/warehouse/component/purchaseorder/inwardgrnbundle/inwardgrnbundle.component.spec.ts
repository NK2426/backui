import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardgrnbundleComponent } from './inwardgrnbundle.component';

describe('InwardpoComponent', () => {
  let component: InwardgrnbundleComponent;
  let fixture: ComponentFixture<InwardgrnbundleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InwardgrnbundleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InwardgrnbundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
