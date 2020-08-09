import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { getSitemapPlugin } from '@gammastream/scully-plugin-sitemap';
// import '@notiz/scully-plugin-rss';

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
  },
});

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
  },
};
