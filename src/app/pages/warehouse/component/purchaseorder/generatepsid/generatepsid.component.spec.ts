import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratepsidComponent } from './generatepsid.component';

describe('GeneratepsidComponent', () => {
  let component: GeneratepsidComponent;
  let fixture: ComponentFixture<GeneratepsidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratepsidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratepsidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
