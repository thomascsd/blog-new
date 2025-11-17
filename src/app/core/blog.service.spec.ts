import { TestBed } from '@angular/core/testing';

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
});
