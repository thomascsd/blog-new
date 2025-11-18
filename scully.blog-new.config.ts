import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { getSitemapPlugin } from '@gammastream/scully-plugin-sitemap';
import 'prismjs/components/prism-csharp.js';
import '@scullyio/scully-plugin-puppeteer';
// import '@notiz/scully-plugin-rss';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

setPluginConfig('md', { enableSyntaxHighlighting: true });
const SitemapPlugin = getSitemapPlugin();
setPluginConfig(SitemapPlugin, {
  urlPrefix: 'https://thomascsd.github.io/',
  sitemapFilename: 'sitemap.xml',
  merge: false,
  changeFreq: 'monthly',
  priority: ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0.0'],
  ignoredRoutes: ['/404'],
  routes: {
    '/blog/:slug': {
      changeFreq: 'daily',
      priority: '0.9',
      sitemapFilename: 'sitemap.xml',
      merge: true,
    },
    '/tags/:tag': {
      changeFreq: 'daily',
      priority: '0.8',
      merge: true,
    },
    '/en/tags/:tag': {
      changeFreq: 'daily',
      priority: '0.8',
      merge: true,
    },
  },
});

/**
 * 從 markdown front-matter 中提取 tags
 */
function extractTags(content: string): string[] {
  const match = content.match(/^---[\s\S]*?tags:\s*\[(.*?)\][\s\S]*?---/m);
  if (!match) {
    return [];
  }

  const tagsStr = match[1];
  return tagsStr
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * 收集所有 tags
 */
function getAllTags() {
  const allTags = new Set<string>();
  const allTagsEn = new Set<string>();

  try {
    // 中文文章
    const blogFiles = readdirSync('./blog').filter((f) => f.endsWith('.md'));
    blogFiles.forEach((file) => {
      const content = readFileSync(join('./blog', file), 'utf-8');
      const tags = extractTags(content);
      tags.forEach((tag) => allTags.add(tag));
    });

    // 英文文章
    const blogEnFiles = readdirSync('./blog/en').filter((f) => f.endsWith('.md'));
    blogEnFiles.forEach((file) => {
      const content = readFileSync(join('./blog/en', file), 'utf-8');
      const tags = extractTags(content);
      tags.forEach((tag) => allTagsEn.add(tag));
    });
  } catch (error) {
    console.warn('Warning: Could not read blog files for tags extraction', error);
  }

  return { allTags: Array.from(allTags), allTagsEn: Array.from(allTagsEn) };
}

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'blog-new',
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: './blog',
      },
      //  postRenderers: ['rss']
    },
    '/tags/:tag': {
      type: 'default',
    },
    '/en/tags/:tag': {
      type: 'default',
    },
  },
};

// 使用 routeDiscoveryDone hook 來注冊 tags 路由
export async function routeDiscoveryDone(routes: any[]): Promise<any[]> {
  const { allTags, allTagsEn } = getAllTags();

  // 中文 tags 路由
  allTags.forEach((tag) => {
    routes.push({
      route: `/tags/${tag}`,
      title: `Tag: ${tag}`,
    });
  });

  // 英文 tags 路由
  allTagsEn.forEach((tag) => {
    routes.push({
      route: `/en/tags/${tag}`,
      title: `Tag: ${tag}`,
    });
  });

  return routes;
}
