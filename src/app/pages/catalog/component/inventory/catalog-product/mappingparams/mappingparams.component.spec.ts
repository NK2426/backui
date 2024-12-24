import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingparamsComponent } from './mappingparams.component';

describe('MappingparamsComponent', () => {
  let component: MappingparamsComponent;
  let fixture: ComponentFixture<MappingparamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MappingparamsComponent]
    });
    fixture = TestBed.createComponent(MappingparamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
