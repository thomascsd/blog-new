const { setPluginConfig } = require('@scullyio/scully');
setPluginConfig('md', { enableSyntaxHighlighting: true });

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
