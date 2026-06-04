import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostTextarea } from './create-post-textarea';

describe('CreatePostTextarea', () => {
  let component: CreatePostTextarea;
  let fixture: ComponentFixture<CreatePostTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePostTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
