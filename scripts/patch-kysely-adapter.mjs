// 补丁：跳过 @better-auth/kysely-adapter 中用不到的 SQLite 方言动态导入
// Vercel Turbopack 追踪这些动态 import 时会因 kysely 版本兼容性报错
// 我们只用 PostgreSQL，这些 SQLite 分支是死代码

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const adapterDir = new URL('../node_modules/@better-auth/kysely-adapter/dist/', import.meta.url);
const indexPath = new URL('./index.mjs', adapterDir);

if (!existsSync(indexPath)) {
  console.log('[patch-kysely-adapter] 未找到 adapter，跳过');
  process.exit(0);
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
console.log('[patch-kysely-adapter] SQLite 方言动态导入已跳过');
