import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComboComponent } from './create-combo.component';

describe('CreateComboComponent', () => {
  let component: CreateComboComponent;
  let fixture: ComponentFixture<CreateComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
