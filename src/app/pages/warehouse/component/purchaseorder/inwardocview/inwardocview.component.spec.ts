import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardocviewComponent } from './inwardocview.component';

describe('ViewComponent', () => {
  let component: InwardocviewComponent;
  let fixture: ComponentFixture<InwardocviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InwardocviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardocviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
