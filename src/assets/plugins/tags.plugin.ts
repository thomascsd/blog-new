import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 自訂 Scully plugin 用於動態生成 tags 路由
 * 用法在 scully.blog-new.config.ts 中註冊
 */
export async function tagsPlugin(routes) {
  const allTags = new Set<string>();
  const allTagsEn = new Set<string>();

  // 讀取所有 markdown 檔案的 front-matter 以提取 tags
  try {
    const blogDir = './blog';
    const blogEnDir = './blog/en';

    // 讀取中文文章
    const files = await readdir(blogDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = readFileSync(join(blogDir, file), 'utf-8');
        const tags = extractTags(content);
        tags.forEach((tag) => allTags.add(tag));
      }
    }

    // 讀取英文文章
    const enFiles = await readdir(blogEnDir);
    for (const file of enFiles) {
      if (file.endsWith('.md')) {
        const content = readFileSync(join(blogEnDir, file), 'utf-8');
        const tags = extractTags(content);
        tags.forEach((tag) => allTagsEn.add(tag));
      }
    }
  } catch (error) {
    console.error('Error reading blog files:', error);
  }

  // 為每個 tag 添加路由
  Array.from(allTags).forEach((tag) => {
    routes.push({
      route: `/tags/${tag}`,
      title: `Tag: ${tag}`,
    });
  });

  Array.from(allTagsEn).forEach((tag) => {
    routes.push({
      route: `/en/tags/${tag}`,
      title: `Tag: ${tag}`,
    });
  });

  return routes;
}

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
