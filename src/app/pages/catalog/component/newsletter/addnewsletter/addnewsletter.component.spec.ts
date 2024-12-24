import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewsletterComponent } from './addnewsletter.component';

describe('AddnewsletterComponent', () => {
  let component: AddnewsletterComponent;
  let fixture: ComponentFixture<AddnewsletterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddnewsletterComponent]
    });
    fixture = TestBed.createComponent(AddnewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
