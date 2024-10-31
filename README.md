# @rolludejo/internal-web-shared

本 repo 主要容纳 rolludejo 的下属项目（如 dicexp、rotext）的共用代码。

注意：本 repo 的存在仅为上述项目内部使用，并不会考虑除此以外的兼容性问题。

最初提取自 [rotext monorepo](https://github.com/umajho/rotext)
[此次 commit](https://github.com/umajho/rotext/commit/7702a2947377d8e317e864ff447a8244d459a528)
下的：

- `packages/solid-components`（前者作为基础模板，以及将部分代码从前者转移至此。）
- `internal/web-utils`（将部分代码从前者转移至此。）

---

如果要引入本包中涉及到 SolidJS 的功能（如 `ShadowRootAttacher`），需要配置
Vite（于 `vite.config.ts`）：

```typescript
// …

export default defineConfig({
  // …
  optimizeDeps: {
    exclude: ["@rolludejo/internal-web-shared"],
  },
  // …
});
```
