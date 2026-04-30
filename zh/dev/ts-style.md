# TypeScript 代码规范

> 本页面由 AI 生成，并已经过人工修改和审核。

<!-- Reviewers: RhenCloud, wyf9 -->

本文档用于统一 TypeScript 项目的代码风格、工具链和提交流程，降低协作成本并提升可维护性。

## 目标

- 类型安全优先，尽量避免 `any` 与隐式类型退化。
- 自动化优先，尽量通过工具而不是人工争论风格问题。
- 本地与 CI 使用同一套检查标准。

## 推荐工具链

- Node.js：`24+`
- 包管理：`bun 1.2+`
- 代码检查：`ESLint`（Flat Config + typescript-eslint 严格规则）
- 代码格式化：`Prettier`
- 类型检查：`TypeScript (tsc --noEmit)`
- 单元测试：`Vitest`
- 提交前钩子：`lefthook`
- 依赖清理：`knip`

## 目录与命名建议

- 文件名使用 `kebab-case`，例如 `user-service.ts`。
- 组件文件使用 `PascalCase`，例如 `UserCard.vue`、`UserCard.tsx`。
- 变量、函数使用 `camelCase`。
- 类型、接口、类使用 `PascalCase`。
- 常量使用 `UPPER_SNAKE_CASE`。

## 语言级约束

- 启用 `strict`，并默认开启以下配置：
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
  - `noImplicitOverride`
  - `useUnknownInCatchVariables`
- 公共 API 必须显式标注返回类型。
- 禁止 `enum`，优先使用 `as const` 与联合字面量类型。
- 优先 `type`；仅在需要可扩展声明合并时使用 `interface`。
- 异步函数禁止“悬空 Promise”，需要 `await`、`return` 或显式 `void`。

## 格式化与静态检查

统一使用 `ESLint + Prettier`：

- `ESLint` 负责代码质量与潜在缺陷检查。
- `Prettier` 负责代码格式化，避免风格争论。
- 使用 Flat Config，并将 `@typescript-eslint` 设为类型感知严格模式。

### 常用命令

```bash
bunx prettier . --write
bunx eslint . --cache --max-warnings=0
bun run typecheck
```

- `prettier --write` 负责代码格式化。
- `eslint` 负责风格、正确性与可维护性检查。
- `--max-warnings=0` 用于在 CI 中阻止“有警告也通过”。

## tsconfig.json 示例

以下配置可作为默认模板：

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src", "tests", "vite.config.ts"]
}
```

## eslint.config.mjs 示例

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importX from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import promise from "eslint-plugin-promise";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "build", "coverage", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "import-x": importX,
      unicorn,
      promise,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "import-x/no-unresolved": "off",
      "promise/catch-or-return": "error",
      "unicorn/prefer-module": "error"
    },
  },
  eslintConfigPrettier
);
```

## .prettierrc 示例

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all"
}
```

## 测试规范

- 测试框架使用 `Vitest`。
- 测试文件命名：`*.test.ts` 或 `*.spec.ts`。
- 一个测试只验证一个主要行为。
- 回归修复必须补充测试。

常用命令：

```bash
bunx vitest run
bunx vitest
bunx vitest --coverage
```

## 提交前检查流程

建议在本地执行以下顺序：

```bash
bunx prettier . --write
bunx eslint . --cache --max-warnings=0
bun run typecheck
bun run test
bunx knip
```

## package.json scripts 示例

```json
{
  "scripts": {
    "format": "prettier . --write",
    "lint": "eslint . --cache --max-warnings=0",
    "lint:fix": "eslint . --fix --cache",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "depcheck": "knip",
    "check": "bun run lint && bun run typecheck && bun run test"
  }
}
```

## 例外与扩展

- 历史项目可先落地 `ESLint + Prettier + tsc`，再逐步引入 `knip`。
- 若外部依赖类型质量较差，可在局部使用 `// @ts-expect-error`，并附上原因。
- 对性能敏感模块可放宽个别规则，但必须在 PR 中说明理由与影响范围。
