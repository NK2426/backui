import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbdetailsComponent } from './awbdetails.component';

describe('AwbdetailsComponent', () => {
  let component: AwbdetailsComponent;
  let fixture: ComponentFixture<AwbdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AwbdetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AwbdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
