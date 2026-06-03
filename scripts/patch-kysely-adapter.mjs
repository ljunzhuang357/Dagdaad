// 补丁：跳过 @better-auth/kysely-adapter 中用不到的 SQLite 方言动态导入
// Vercel Turbopack 追踪这些动态 import 时会因 kysely 版本兼容性报错
// 我们只用 PostgreSQL，这些 SQLite 分支是死代码
// 需要打两个位置：顶层 node_modules + better-auth 嵌套的 node_modules

import { readFileSync, writeFileSync, existsSync } from 'fs';

const paths = [
  new URL('../node_modules/@better-auth/kysely-adapter/dist/index.mjs', import.meta.url),
  new URL('../node_modules/better-auth/node_modules/@better-auth/kysely-adapter/dist/index.mjs', import.meta.url),
];

for (const indexPath of paths) {
  if (!existsSync(indexPath)) {
    console.log(`[patch-kysely-adapter] 跳过: ${indexPath.pathname}`);
    continue;
  }

  let code = readFileSync(indexPath, 'utf-8');

  // 替换三个 SQLite 方言的动态导入为返回空对象的 Promise
  // await import("./bun-sqlite-dialect-*.mjs") → await Promise.resolve({})
  code = code.replace(
    /const\s*\{\s*\w+\s*\}\s*=\s*await\s+import\([^)]*bun-sqlite-dialect[^)]*\)/g,
    'const {} = await Promise.resolve({})'
  );
  code = code.replace(
    /const\s*\{\s*\w+\s*\}\s*=\s*await\s+import\([^)]*node-sqlite-dialect[^)]*\)/g,
    'const {} = await Promise.resolve({})'
  );
  code = code.replace(
    /const\s*\{\s*\w+\s*\}\s*=\s*await\s+import\([^)]*d1-sqlite-dialect[^)]*\)/g,
    'const {} = await Promise.resolve({})'
  );

  writeFileSync(indexPath, code, 'utf-8');
  console.log(`[patch-kysely-adapter] 已跳过: ${indexPath.pathname}`);
}
