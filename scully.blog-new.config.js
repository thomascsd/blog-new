"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var scully_1 = require("@scullyio/scully");
var scully_plugin_sitemap_1 = require("@gammastream/scully-plugin-sitemap");
require("prismjs/components/prism-csharp");
// import '@notiz/scully-plugin-rss';
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
var SitemapPlugin = scully_plugin_sitemap_1.getSitemapPlugin();
scully_1.setPluginConfig(SitemapPlugin, {
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
exports.config = {
    projectRoot: './src',
    projectName: 'blog-new',
    outDir: './dist/static',
    routes: {
        '/blog/:slug': {
            type: 'contentFolder',
            slug: {
                folder: './blog',
            },
        },
    },
};
