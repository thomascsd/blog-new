import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostHeaderComponent } from './post-header.component';

describe('PostHeaderComponent', () => {
  let component: PostHeaderComponent;
  let fixture: ComponentFixture<PostHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
