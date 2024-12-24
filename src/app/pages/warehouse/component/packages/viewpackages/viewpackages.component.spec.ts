import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpackagesComponent } from './viewpackages.component';

describe('ViewpackagesComponent', () => {
  let component: ViewpackagesComponent;
  let fixture: ComponentFixture<ViewpackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewpackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewpackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
