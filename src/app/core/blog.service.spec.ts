import { TestBed } from '@angular/core/testing';
import { ScullyRoute } from '@scullyio/ng-lib';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isEnglishRoute', () => {
    it('returns true for /en prefix', () => {
      expect(service.isEnglishRoute('/en')).toBeTrue();
      expect(service.isEnglishRoute('/en/')).toBeTrue();
      expect(service.isEnglishRoute('/en/some-page')).toBeTrue();
    });

    it('returns true for ASCII-only paths', () => {
      expect(service.isEnglishRoute('/blog/2024-09-01-Slug')).toBeTrue();
      expect(service.isEnglishRoute('about')).toBeTrue();
      expect(service.isEnglishRoute('/2025-11-17-ZenBrowser')).toBeTrue();
    });

    it('returns false for paths containing non-ASCII characters', () => {
      expect(service.isEnglishRoute('/blog/測試')).toBeFalse();
      expect(service.isEnglishRoute('/zh/路徑')).toBeFalse();
      expect(service.isEnglishRoute('/2025-11-17-食譜')).toBeFalse();
    });

    it('returns false for empty or invalid paths', () => {
      expect(service.isEnglishRoute('')).toBeFalse();
      expect(service.isEnglishRoute(null)).toBeFalse();
      expect(service.isEnglishRoute(undefined)).toBeFalse();
    });
  });

  describe('formatTagName', () => {
    it('formats tag with hyphens to title case', () => {
      expect(service.formatTagName('angular')).toBe('Angular');
      expect(service.formatTagName('vuejs')).toBe('Vuejs');
      expect(service.formatTagName('asp-net')).toBe('Asp-Net');
      expect(service.formatTagName('command-line')).toBe('Command-Line');
    });

    it('returns empty string for empty input', () => {
      expect(service.formatTagName('')).toBe('');
      expect(service.formatTagName(null)).toBe('');
      expect(service.formatTagName(undefined)).toBe('');
    });
  });

  describe('getTagsFromRoute', () => {
    it('extracts tags from route object', () => {
      const route: ScullyRoute = {
        route: '/blog/test',
        title: 'Test',
        tags: ['angular', 'typescript'],
      } as any;

      expect(service.getTagsFromRoute(route)).toEqual(['angular', 'typescript']);
    });

    it('returns empty array if no tags property', () => {
      const route: ScullyRoute = {
        route: '/blog/test',
        title: 'Test',
      } as any;

      expect(service.getTagsFromRoute(route)).toEqual([]);
    });
  });

  describe('getAllTags', () => {
    const mockRoutes: ScullyRoute[] = [
      { route: '/blog/test1', title: 'Test 1', tags: ['angular', 'typescript'] } as any,
      { route: '/blog/test2', title: 'Test 2', tags: ['angular', 'vuejs'] } as any,
      { route: '/blog/test3', title: 'Test 3', tags: ['typescript'] } as any,
      { route: '/blog/en/test4', title: 'Test 4', tags: ['react'] } as any,
    ];

    it('collects and counts all tags for Chinese routes', () => {
      const tags = service.getAllTags(mockRoutes, false);
      expect(tags).toContainEqual({ tag: 'angular', count: 2 });
      expect(tags).toContainEqual({ tag: 'typescript', count: 2 });
      expect(tags).toContainEqual({ tag: 'vuejs', count: 1 });
    });

    it('collects and counts all tags for English routes', () => {
      const tags = service.getAllTags(mockRoutes, true);
      expect(tags).toEqual([{ tag: 'react', count: 1 }]);
    });

    it('sorts by count descending, then alphabetically', () => {
      const routes: ScullyRoute[] = [
        { route: '/blog/a', tags: ['zebra', 'apple'] } as any,
        { route: '/blog/b', tags: ['zebra', 'banana'] } as any,
        { route: '/blog/c', tags: ['apple'] } as any,
      ];

      const tags = service.getAllTags(routes, false);
      expect(tags[0].tag).toBe('zebra');
      expect(tags[0].count).toBe(2);
      expect(tags[1].tag).toBe('apple');
      expect(tags[1].count).toBe(2);
      expect(tags[2].tag).toBe('banana');
      expect(tags[2].count).toBe(1);
    });
  });

  describe('getArticlesByTag', () => {
    const mockRoutes: ScullyRoute[] = [
      { route: '/blog/test1', title: 'Test 1', tags: ['angular', 'typescript'] } as any,
      { route: '/blog/test2', title: 'Test 2', tags: ['angular', 'vuejs'] } as any,
      { route: '/blog/test3', title: 'Test 3', tags: ['typescript'] } as any,
      { route: '/blog/en/test4', title: 'Test 4', tags: ['angular'] } as any,
    ];

    it('returns articles with specific tag for Chinese routes', () => {
      const articles = service.getArticlesByTag(mockRoutes, 'angular', false);
      expect(articles.length).toBe(2);
      expect(articles[0].route).toBe('/blog/test1');
      expect(articles[1].route).toBe('/blog/test2');
    });

    it('returns articles with specific tag for English routes', () => {
      const articles = service.getArticlesByTag(mockRoutes, 'angular', true);
      expect(articles.length).toBe(1);
      expect(articles[0].route).toBe('/blog/en/test4');
    });

    it('returns empty array if tag not found', () => {
      const articles = service.getArticlesByTag(mockRoutes, 'nonexistent', false);
      expect(articles).toEqual([]);
    });
  });
});
