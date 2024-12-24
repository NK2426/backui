import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapparamsComponent } from './mapparams.component';

describe('MapparamsComponent', () => {
  let component: MapparamsComponent;
  let fixture: ComponentFixture<MapparamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapparamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapparamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
