import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { of } from 'rxjs';

import { BlogService } from '../core/blog.service';
import { TagDetailComponent } from './tag-detail.component';

describe('TagDetailComponent', () => {
  let component: TagDetailComponent;
  let fixture: ComponentFixture<TagDetailComponent>;
  let mockActivatedRoute: any;
  let mockScullyService: jasmine.SpyObj<ScullyRoutesService>;
  let mockBlogService: jasmine.SpyObj<BlogService>;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ tag: 'angular' }),
      snapshot: { url: ['tags', 'angular'] },
    };

    mockScullyService = jasmine.createSpyObj('ScullyRoutesService', [], {
      available$: of([
        { route: '/blog/test1', title: 'Test 1', tags: ['angular', 'typescript'] } as any,
        { route: '/blog/test2', title: 'Test 2', tags: ['angular'] } as any,
      ]),
    });

    mockBlogService = jasmine.createSpyObj('BlogService', [
      'isEnglishRoute',
      'formatTagName',
      'getArticlesByTag',
      'getPostDateFormRoute',
    ]);
    mockBlogService.isEnglishRoute.and.returnValue(false);
    mockBlogService.formatTagName.and.returnValue('Angular');
    mockBlogService.getArticlesByTag.and.returnValue([
      { route: '/blog/test1', title: 'Test 1', tags: ['angular', 'typescript'] } as any,
      { route: '/blog/test2', title: 'Test 2', tags: ['angular'] } as any,
    ]);
    mockBlogService.getPostDateFormRoute.and.returnValue('2024-01-01');

    await TestBed.configureTestingModule({
      declarations: [TagDetailComponent],
      imports: [RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ScullyRoutesService, useValue: mockScullyService },
        { provide: BlogService, useValue: mockBlogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles for the tag on init', (done) => {
    fixture.detectChanges();

    component.articles$.subscribe((articles) => {
      expect(mockBlogService.getArticlesByTag).toHaveBeenCalled();
      expect(articles.length).toBe(2);
      expect(component.tag).toBe('angular');
      expect(component.displayName).toBe('Angular');
      done();
    });
  });
});
