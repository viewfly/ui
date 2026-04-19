# viewfly-ui：Agent / 贡献者约定（单一来源）

本文档为本仓库**面向人类与 AI 助手的项目级约定**正文。各编辑器入口（如 Cursor rules、Copilot instructions）应指向本节，避免多处全文重复维护。

**官方文档**：依赖注入见 [Viewfly 依赖注入](https://viewfly.org/guide/di)。

---

## 目录

1. [Viewfly：依赖注入与跨组件通信](#viewfly-dependency-injection)
2. [Viewfly 组件本地状态：`createSignal` 与 `reactive`](#viewfly-state-signal-reactive)
3. [Viewfly 组件与 Props 响应性](#viewfly-props-reactivity)
4. [Viewfly 与 JSXNode](#viewfly-jsxnode)
5. [组件样式（UnoCSS + SCSS）](#unocss-component-styles)

---

<a id="viewfly-dependency-injection"></a>

## Viewfly：依赖注入与跨组件通信

在组件库中需要**父子/祖先与后代**共享状态（如 RadioGroup、Form、主题）时，优先用 **`createContextProvider` + `InjectionToken` + `inject`**，而不是仅靠 props 层层下传。

### 推荐结构

1. **`InjectionToken<T>`**：定义上下文类型 `T`（与业务相关的只读/操作接口）。
2. **`createContextProvider({ provide: token })`**：得到 Provider 组件；在**提供方组件**的渲染中通过 **`useValue={...}`** 注入实现（每实例一份上下文时，在提供方 `setup` 内组装对象，避免无意义的引用抖动）。
3. **消费方**：在子组件**主函数体**内调用 **`inject(token, notFoundValue?)`**；未找到依赖时返回 `notFoundValue`，**不必**再传 `InjectFlags.Optional`（与「可选依赖」语义一致）；仅在使用 **Self / SkipSelf** 等查找规则时才传第三个参数 `flags`。

### `withAnnotation` 与 `inject` 的作用域

- 通过 **`withAnnotation({ providers: [...] }, setup)`** 注册的依赖，**不仅后代组件**可以 `inject`，**当前这个被 `withAnnotation` 包住的组件**在 **`setup` 主函数体里**同样可以用 **`inject`** 取到（`providers` 挂在本组件对应注入器上，与官方文档一致）。
- 若用 **`createContextProvider` + `useValue`**，则由 **Provider 子树**解析；提供值的逻辑通常在**渲染 Provider 的组件**内组装 `ctx`，一般不再在同一函数里对自己 `inject` 同 token（与 `withAnnotation` 的挂载点不同）。

### 与响应式的关系（必须遵守）

文档说明：**Viewfly 不会监听 provide/inject 中「普通对象字段」的变化**；组件更新仍依赖渲染时订阅的 **`Signal` / `createDerived` / `reactive`**。

- **错误**：`inject` 拿到 `{ count: 0 }`，只改 `count` 字段，期望子组件自动刷新。
- **正确**：上下文里放 **`Signal` / `createDerived` 等**，子组件在**返回的渲染函数**里调用 **`ctx.count()`** / **`ctx.selected()`**，与下文「createSignal / reactive」中的 Signal 用法一致。

### 最小示意

```tsx
// context.ts
import { createContextProvider, InjectionToken, type Signal } from '@viewfly/core'

export interface MyGroupCtx {
  value: Signal<string | undefined>
  setValue: (v: string) => void
}
export const myGroupToken = new InjectionToken<MyGroupCtx>('MyGroup')
export const MyGroupProvider = createContextProvider({ provide: myGroupToken })
```

```tsx
// Group.tsx — 主体内用 createSignal / createDerived 组装 ctx，不要解构 props（见「Props 响应性」）
export function MyGroup(props: { value?: string; defaultValue?: string; children?: JSXNode }) {
  const inner = createSignal(props.defaultValue)
  const value = createDerived(() => (props.value !== undefined ? props.value : inner()))
  const ctx: MyGroupCtx = { value, setValue: (v) => { /* ... */ } }
  return () => (
    <MyGroupProvider useValue={ctx}>
      <div>{props.children}</div>
    </MyGroupProvider>
  )
}
```

```tsx
// Child.tsx
import { inject } from '@viewfly/core'
import { myGroupToken } from './context'

export function Child(props: { id: string }) {
  const group = inject(myGroupToken, null) // 组外为 null，无需 InjectFlags.Optional
  return () => {
    if (!group) return <span>单独使用</span>
    const current = group.value()
    return <span>{current}</span>
  }
}
```

### 与 props 规则的关系

提供方、消费方仍遵守 **主体内不解构 `props`**，仅在**内层渲染函数**解构，见 [Viewfly 组件与 Props 响应性](#viewfly-props-reactivity)。

### 参考实现

仓库内 **`RadioGroup` / `Radio`**（`packages/components/src/components/radio/`）为完整落地示例。

---

<a id="viewfly-state-signal-reactive"></a>

## Viewfly 组件本地状态：`createSignal` 与 `reactive`

### 选择原则

- **简单标量状态**（数字、布尔、字符串等单一值）：优先用 **`createSignal`**，粒度细、更新路径清晰，便于按需追踪。
- **多个字段共同描述一块 UI 状态**（如 `{ open, x, y }`、表单草稿、面板布局）：优先用 **`reactive`** 创建响应式对象，避免大量分散的 signal 与成组更新时的多次触发。

### 正例

```tsx
import { createSignal, reactive } from '@viewfly/core'

export function Panel() {
  const visible = createSignal(false) // 单一布尔
  const draft = reactive({ title: '', count: 0 }) // 多字段一组状态

  return () => (
    <div>
      {visible() ? <span>{draft.title}</span> : null}
    </div>
  )
}
```

### 反例

```tsx
// ❌ 多个相关标量各自 createSignal，可读性与成组更新较差（除非字段完全独立）
const open = createSignal(false)
const posX = createSignal(0)
const posY = createSignal(0)

// ❌ 仅为一个数字/字符串包一层 reactive，偏重
const count = reactive({ value: 0 })
```

### 边界

- 字段**彼此独立**、无「一起变」的语义时，多个 `createSignal` 仍合理。
- 从 `@viewfly/core` 按需导入 `createSignal`、`reactive`，与现有组件保持一致。

---

<a id="viewfly-props-reactivity"></a>

## Viewfly 组件与 Props 响应性

### 必须遵守

- **`props` 是响应式对象**：在**组件主函数体**（`setup` 等价区域、`return () => ...` 之外）**不要**对 `props` 做解构、展开到局部常量，否则会断开与响应式源的连接，后续更新可能不触发视图更新。
- **渲染函数内可解构**：在**组件返回的渲染函数**里（内层 `() => { ... }`）再解构 `props`，便于读取默认值与字段，此时访问的是随更新刷新的视图阶段读取。

### 结构示意

```tsx
export function Component(props: ComponentProps) {
  // 组件主体：可写逻辑，但不要用 const { a, b } = props

  return () => {
    // 渲染函数：此处可解构 props
    const { a, b = 'default' } = props
    return <div>{a}{b}</div>
  }
}
```

### 反例与正例

```tsx
// ❌ 在主体内解构，破坏响应性
export function Bad(props: Props) {
  const { count } = props
  return () => <span>{count}</span>
}

// ✅ 在返回的渲染函数内解构
export function Good(props: Props) {
  return () => {
    const { count } = props
    return <span>{count}</span>
  }
}
```

若主体内仅需**单次非响应**快照且明确有意为之，需在代码审查中单独说明；默认按上述规则处理。

---

<a id="viewfly-jsxnode"></a>

## Viewfly 与 JSXNode

### 必须遵守

- **通用「节点」类型使用 `JSXNode`**（从 `@viewfly/core` 导入），**不要**用 `JSX.Element` 表示子节点、插槽等可渲染内容。
- **`JSX.Element` 偏窄**：Viewfly 中 `JSXNode` 包含元素、类组件、字符串、数字、可迭代子节点等，与框架内部 `Props['children']` 等声明一致。

### 正例

```tsx
import type { JSXNode } from '@viewfly/core'

export interface FooProps {
  children?: JSXNode
  extra?: JSXNode
}
```

### 反例

```tsx
import type { JSX } from '@viewfly/core'

export interface FooProps {
  children?: JSX.Element // ❌ 改用 JSXNode
}
```

---

<a id="unocss-component-styles"></a>

## 组件样式（UnoCSS + SCSS）

### 必须遵守

- **样式来源**：组件的视觉样式一律通过 **UnoCSS** 表达；在 SCSS 中用 `@apply` 组合原子类，不要手写与 Uno 重复的 longhand（颜色/间距/布局等优先用工具类语义）。
- **文件位置**：每个组件单独一个 SCSS 文件，与组件同目录、由组件 `import`；不要在 TSX 里写 `<style>` 或内联 `style={{}}`（动态值除外）。
- **类名**：使用 **有语义的、稳定的** class，推荐 **`vfui-` + 块名**，修饰符用 BEM 风格：`vfui-块名`、`vfui-块名__元素`、`vfui-块名--修饰符`；在 JSX 里把这些类挂到对应 DOM 上，避免无意义缩写（如 `.a`、`.x1`）。

### 构建

- **`packages/components`** 的 Vite 已启用 **`unocss/vite`**，且 **`uno.config.ts`** 含 **`transformerDirectives`**，SCSS 中的 `@apply` 会在构建时展开；产物中不应再出现 `@apply` 或未使用的原子类名依赖。

### 示例

**TSX**：语义类名挂在元素上。

```tsx
import './style.scss'

// ✅
<button type="button" class={`vfui-button vfui-button--${type}`} disabled={disabled}>
```

**SCSS**：`@apply` 组合 Uno 工具类；设计 token 用 CSS 变量，避免与 Uno 阶梯重复手写。

```scss
.vfui-button {
  @apply inline-flex items-center justify-center border border-solid rounded-md text-sm;
  @apply bg-[var(--vfui-btn-default-bg)] text-[var(--vfui-btn-default-text)] border-[var(--vfui-btn-default-border)];
}

.vfui-button--primary {
  @apply bg-[var(--vfui-color-primary)] text-[var(--vfui-fg-on-primary)] border-[var(--vfui-color-primary)];
}
```

### 反例

- 在 TSX 里堆一长串 Uno 原子类字符串作为主样式（应收到 SCSS + 语义 class）。
- 同一组件样式散落在多个未约定的全局文件里。
