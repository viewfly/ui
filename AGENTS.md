# Agent 说明（viewfly-ui）

修改本仓库（尤其是 `packages/` 下组件与样式）时，**以 [`docs/agent-guidelines.md`](docs/agent-guidelines.md) 为唯一正文**：其中包含 Viewfly DI/Context、Props 响应性、`createSignal`/`reactive`、`JSXNode` 类型约定，以及 UnoCSS + SCSS 样式规范与示例。

## 使用方式

- **人工**：在 PR / 评审中引用该文档对应章节。
- **AI**：在对话中 `@docs/agent-guidelines.md`，或打开文档后按章节检索；无需依赖某一编辑器的私有规则格式。

## 章节速查

| 主题 | 文档锚点 |
|------|----------|
| DI / `createContextProvider` / `inject` | [`docs/agent-guidelines.md#viewfly-dependency-injection`](docs/agent-guidelines.md#viewfly-dependency-injection) |
| `createSignal` / `reactive` | [`docs/agent-guidelines.md#viewfly-state-signal-reactive`](docs/agent-guidelines.md#viewfly-state-signal-reactive) |
| Props 不在主体内解构 | [`docs/agent-guidelines.md#viewfly-props-reactivity`](docs/agent-guidelines.md#viewfly-props-reactivity) |
| 子节点类型 `JSXNode` | [`docs/agent-guidelines.md#viewfly-jsxnode`](docs/agent-guidelines.md#viewfly-jsxnode) |
| UnoCSS + SCSS / `vfui-` 类名 | [`docs/agent-guidelines.md#unocss-component-styles`](docs/agent-guidelines.md#unocss-component-styles) |

`.cursor/rules/*.mdc` 仅用于 **Cursor** 按路径自动附加摘要；**维护规范时请只改 `docs/agent-guidelines.md`**，再视需要同步 `.mdc` 中的简短摘要。
