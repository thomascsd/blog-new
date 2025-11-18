import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { of } from 'rxjs';

import { BlogService } from '../core/blog.service';
import { TagsListComponent } from './tags-list.component';

describe('TagsListComponent', () => {
  let component: TagsListComponent;
  let fixture: ComponentFixture<TagsListComponent>;
  let mockScullyService: jasmine.SpyObj<ScullyRoutesService>;
  let mockBlogService: jasmine.SpyObj<BlogService>;

  beforeEach(async () => {
    mockScullyService = jasmine.createSpyObj('ScullyRoutesService', [], {
      available$: of([
        { route: '/blog/test1', title: 'Test 1', tags: ['angular', 'typescript'] } as any,
        { route: '/blog/test2', title: 'Test 2', tags: ['angular'] } as any,
      ]),
    });

    mockBlogService = jasmine.createSpyObj('BlogService', ['getAllTags', 'formatTagName']);
    mockBlogService.getAllTags.and.returnValue([
      { tag: 'angular', count: 2 },
      { tag: 'typescript', count: 1 },
    ]);
    mockBlogService.formatTagName.and.callFake((tag) => {
      return tag
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
    });

    await TestBed.configureTestingModule({
      declarations: [TagsListComponent],
      imports: [RouterModule],
      providers: [
        { provide: ScullyRoutesService, useValue: mockScullyService },
        { provide: BlogService, useValue: mockBlogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tags on init', (done) => {
    fixture.detectChanges();

    component.tags$.subscribe((tags) => {
      expect(mockBlogService.getAllTags).toHaveBeenCalled();
      expect(tags.length).toBe(2);
      done();
    });
  });

  it('should format tag names', () => {
    expect(component.formatTagName('angular')).toBe('Angular');
    expect(component.formatTagName('asp-net')).toBe('Asp-Net');
  });
});
