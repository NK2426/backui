import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceviedComponent } from './recevied.component';

describe('ReceviedComponent', () => {
  let component: ReceviedComponent;
  let fixture: ComponentFixture<ReceviedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceviedComponent]
    });
    fixture = TestBed.createComponent(ReceviedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
