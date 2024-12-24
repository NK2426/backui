import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCombosetItemComponent } from './upsert-comboset-item.component';

describe('UpsertCombosetItemComponent', () => {
  let component: UpsertCombosetItemComponent;
  let fixture: ComponentFixture<UpsertCombosetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertCombosetItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertCombosetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
