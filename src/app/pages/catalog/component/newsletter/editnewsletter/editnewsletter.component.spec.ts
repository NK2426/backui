import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditnewsletterComponent } from './editnewsletter.component';

describe('EditnewsletterComponent', () => {
  let component: EditnewsletterComponent;
  let fixture: ComponentFixture<EditnewsletterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditnewsletterComponent]
    });
    fixture = TestBed.createComponent(EditnewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
