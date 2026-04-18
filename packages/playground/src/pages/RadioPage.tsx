import { createSignal } from '@viewfly/core'
import { Radio, RadioGroup } from '@viewfly/ui-components'

export function RadioPage() {
  const plan = createSignal<'free' | 'pro'>('free')
  const nativeEcho = createSignal<string>('')
  const groupPlan = createSignal<'free' | 'pro'>('pro')
  const groupNative = createSignal<string>('')

  return () => (
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Radio</h2>

      <section class="mb-8 flex flex-col gap-3">
        <h3 class="text-sm font-medium vfui-text-muted">RadioGroup（受控 + DI）</h3>
        <RadioGroup
          name="group-plan"
          value={groupPlan()}
          onChange={(v) => groupPlan.set(v as 'free' | 'pro')}
        >
          <Radio value="free">免费版</Radio>
          <Radio value="pro">专业版</Radio>
        </RadioGroup>
        <span class="text-sm vfui-text-muted">当前：{groupPlan()}</span>
      </section>

      <section class="mb-8 flex flex-col gap-3">
        <h3 class="text-sm font-medium vfui-text-muted">RadioGroup（非受控）</h3>
        <RadioGroup name="group-tier" defaultValue="basic" onChange={(v) => groupNative.set(v)}>
          <Radio value="basic">Basic</Radio>
          <Radio value="plus">Plus</Radio>
        </RadioGroup>
        <span class="text-sm vfui-text-muted">最近 onChange：{groupNative() || 'basic（初始）'}</span>
      </section>

      <section class="mb-8 flex flex-col gap-3">
        <h3 class="text-sm font-medium vfui-text-muted">受控组（同一 name）</h3>
        <div class="flex flex-col gap-2">
          <Radio
            name="plan"
            value="free"
            checked={plan() === 'free'}
            onChange={(v) => plan.set(v as 'free' | 'pro')}
          >
            免费版
          </Radio>
          <Radio
            name="plan"
            value="pro"
            checked={plan() === 'pro'}
            onChange={(v) => plan.set(v as 'free' | 'pro')}
          >
            专业版
          </Radio>
        </div>
        <span class="text-sm vfui-text-muted">当前：{plan()}</span>
      </section>

      <section class="mb-8 flex flex-col gap-3">
        <h3 class="text-sm font-medium vfui-text-muted">非受控原生组（仅传 name，不传 checked）</h3>
        <div class="flex flex-col gap-2">
          <Radio name="tier" value="basic" defaultChecked onChange={(v) => nativeEcho.set(v)}>
            Basic
          </Radio>
          <Radio name="tier" value="plus" onChange={(v) => nativeEcho.set(v)}>
            Plus
          </Radio>
        </div>
        <span class="text-sm vfui-text-muted">最近 onChange：{nativeEcho() || '（尚未切换）'}</span>
      </section>

      <section class="mb-8 flex flex-wrap items-center gap-4">
        <h3 class="text-sm font-medium vfui-text-muted w-full">单独非受控（无 name）</h3>
        <Radio defaultChecked>仅此一项</Radio>
      </section>

      <section class="mb-8 flex flex-col gap-2">
        <h3 class="text-sm font-medium vfui-text-muted w-full">禁用</h3>
        <Radio name="x" value="a" checked disabled>
          禁用已选
        </Radio>
        <Radio name="x" value="b" disabled>
          禁用未选
        </Radio>
      </section>

      <p class="text-xs vfui-text-muted">
        推荐使用 <code class="text-primary-600 dark:text-primary-400">RadioGroup</code> 管理选中值与 name；也可手写受控{' '}
        <code class="text-primary-600 dark:text-primary-400">checked</code> 或仅传 name 走原生非受控组。组内 Radio 的{' '}
        <code class="text-primary-600 dark:text-primary-400">checked</code> /{' '}
        <code class="text-primary-600 dark:text-primary-400">defaultChecked</code> /{' '}
        <code class="text-primary-600 dark:text-primary-400">onChange</code> 由组接管。
      </p>
    </div>
  )
}
