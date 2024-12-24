import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertbillComponent } from './upsertbill.component';

describe('UpsertbillComponent', () => {
  let component: UpsertbillComponent;
  let fixture: ComponentFixture<UpsertbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
