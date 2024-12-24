import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewshelfComponent } from './viewshelf.component';

describe('ViewshelfComponent', () => {
  let component: ViewshelfComponent;
  let fixture: ComponentFixture<ViewshelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewshelfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewshelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
