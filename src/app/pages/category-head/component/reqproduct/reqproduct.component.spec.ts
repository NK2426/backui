import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqproductComponent } from './reqproduct.component';

describe('ReqproductComponent', () => {
  let component: ReqproductComponent;
  let fixture: ComponentFixture<ReqproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqproductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
