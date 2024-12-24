import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertcrateComponent } from './upsertcrate.component';

describe('UpsertcrateComponent', () => {
  let component: UpsertcrateComponent;
  let fixture: ComponentFixture<UpsertcrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertcrateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertcrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
