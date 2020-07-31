const fs = require('fs');
const path = require('path');
const util = require('util');
const $ = require('draxt');
const consola = require('consola');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

(async () => {
  const rootPath = path.join(process.cwd(), '..');
  const blogDistPath = `/thomascsd.github.io/`;
  let $blogSrc = await $('./dist/static/**');
  const $blogDist = await $('.' + blogDistPath + '**', {
    cwd: rootPath
  });

  $blogDist
    .filter(
      node =>
        (node.isDirectory() && node.baseName.indexOf('.') === -1) ||
        node.isFile()
    )
    .each(async node => {
      consola.info(
        `step1-1:刪除thomascsd.github.io內的檔案，name:${node.pathName}`
      );
      await node.remove();
    });

  /*consola.info(`step2:api.js的localhost更換成thomascsd.github.io`);
  const $api = $blogSrc
    .filter(
      node => node.baseName.indexOf('app.') !== -1 && node.extension === 'js'
    )
    .first();

  let content = await readFileAsync($api.pathName);
  content = content
    .toString()
    .replace(/http:\/\/localhost:3200/i, 'https://thomascsd.github.io');
  await writeFileAsync($api.pathName, content);*/

  const blogPath = path.join(rootPath, blogDistPath);

  $blogSrc = await $('./dist/static');
  $blogSrc.each(async node => {
    consola.info(
      `step2:複製檔案至thomascsd.github.io內的檔案，name:${node.pathName}`
    );

    try {
      await node.copy(blogPath);
    } catch (err) {
      consola.error(err);
    }
  });
})().catch(err => consola.error(err));
