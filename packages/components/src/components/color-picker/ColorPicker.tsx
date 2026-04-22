import {
  any2Hsl,
  type ColorHSL, type ColorHSV, type ColorRGB, type ColorRGBA, hex2Hsl, hex2Hsv, hex2Rgb,
  hsl2Hex, hsl2Hsv, hsl2Rgb, hsv2Hex, hsv2Hsl, hsv2Rgb, normalizeHex, parseCss, rgb2Hex, rgb2Hsl, rgb2Hsv
} from '@tanbo/color'
import { createEffect, createRef, createSignal, getCurrentInstance } from '@viewfly/core'
import { Button } from '../button/Button'
import { Dropdown } from '../dropdown/Dropdown'
import { Input } from '../input/Input'
import { readRecentColorsCache, resolveInitialRecentColors, writeRecentColorsCache } from './recent-colors-cache'
import './style.scss'

function listenDocumentWhileDrag(onMove: (ev: MouseEvent) => void) {
  const onMouseMove = (ev: MouseEvent) => onMove(ev)
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

export class Picker {
  set hex(color: string) {
    const c = color ? normalizeHex(color) : null
    if (c) {
      this.empty = false
      this._hex = c
      this._hsl = hex2Hsl(c)
      this._rgb = hex2Rgb(c)
      this._hsv = hex2Hsv(c)
      this._rgba = {
        ...this._rgb,
        a: this.resetAlpha ? 1 : this._rgba?.a || 1
      }
    } else {
      this.empty = true
    }
    this.resetAlpha = true
    this.onChange()
  }

  get hex(): string | null {
    return this.empty ? null : this._hex
  }

  set hsl(color: ColorHSL) {
    if (!color || typeof color.h !== 'number' || typeof color.s !== 'number' || typeof color.l !== 'number') {
      this.empty = true
    } else {
      this.empty = false
      this._hsl = color
      this._hex = hsl2Hex(color)
      this._hsv = hsl2Hsv(color)
      this._rgb = hsl2Rgb(color)
      this._rgba = {
        ...this._rgb,
        a: this.resetAlpha ? 1 : this._rgba?.a || 1
      }
    }
    this.resetAlpha = true
    this.onChange()
  }

  get hsl(): ColorHSL | null {
    return this.empty ? null : this._hsl
  }

  set rgb(color: ColorRGB) {
    if (!color || typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') {
      this.empty = true
    } else {
      this.empty = false
      this._rgb = color
      this._rgba = {
        ...color,
        a: this.resetAlpha ? 1 : this._rgba?.a || 1
      }
      this._hsl = rgb2Hsl(color)
      this._hex = rgb2Hex(color)
      this._hsv = rgb2Hsv(color)
    }

    this.resetAlpha = true
    this.onChange()
  }

  get rgb(): ColorRGB | null {
    return this.empty ? null : this._rgb
  }

  set rgba(color: ColorRGBA) {
    if (!color
      || typeof color.r !== 'number'
      || typeof color.g !== 'number'
      || typeof color.b !== 'number'
      || typeof color.a !== 'number') {
      this.empty = true
    } else {
      this.empty = false
      this._rgba = color
      this._hsl = rgb2Hsl(color)
      this._hex = rgb2Hex(color)
      this._hsv = rgb2Hsv(color)
    }
    this.onChange()
  }

  get rgba(): ColorRGBA | null {
    return this.empty ? null : this._rgba
  }

  set hsv(color: ColorHSV) {
    if (!color || typeof color.h !== 'number' || typeof color.s !== 'number' || typeof color.v !== 'number') {
      this.empty = true
    } else {
      this.empty = false
      this._hsv = color
      this._hex = hsv2Hex(color)
      this._hsl = hsv2Hsl(color)
      this._rgb = hsv2Rgb(color)
      this._rgba = {
        ...this._rgb,
        a: this.resetAlpha ? 1 : this._rgba?.a || 1
      }
    }
    this.resetAlpha = true
    this.onChange()
  }

  get hsv(): ColorHSV | null {
    return this.empty ? null : this._hsv
  }

  private _hex = ''
  private _hsl: ColorHSL | null = null
  private _rgb: ColorRGB | null = null
  private _hsv: ColorHSV | null = null
  private _rgba: ColorRGBA | null = null

  empty = false
  resetAlpha = true

  constructor(
    private onChange: () => void,
    value?: string
  ) {
    this.hex = value || '#f00'
  }
}

export interface ColorPickerProps {
  value?: string
  /** 最近使用色（无 `recentColorsName` 时由外部传入，不持久化） */
  recentColors?: string[]
  /**
   * 非空时按此名称在 `localStorage` 持久化「常用颜色」，同一名称在多次打开间共享。
   * 有缓存时优先用缓存，否则用 `recentColors` 作初始项。
   */
  recentColorsName?: string
  /** 调色盘 `Dropdown` 的挂载节点，与 `Dropdown` 的 `getContainer` 相同 */
  getContainer?: () => HTMLElement
  onChange?(picker: Picker): void
  onSelected?(picker: Picker): void
}

export function ColorPicker(props: ColorPickerProps) {
  const instance = getCurrentInstance()
  const picker = new Picker(() => {
    instance.markAsDirtied()
  }, props.value)

  const mainColors: string[] = [
    '#000', '#333', '#444', '#555', '#666', '#777', '#888',
    '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#eee', '#fff',
  ]
  const colors: string[] = [
    '#fec6c2', '#fee5c3', '#fefcc3', '#baf6c4', '#c3ebfe', '#c3cbfe', '#e1caff',
    '#fc8e88', '#fccc88', '#fcf888', '#76ec8a', '#88d8fc', '#97a4fb', '#c098f4',
    '#ff6666', '#ffb151', '#fada3a', '#18c937', '#3aaafa', '#6373e2', '#a669f7',
    '#f63030', '#f88933', '#deb12a', '#038e23', '#1276cc', '#3f52ce', '#8838ed',
    '#c60000', '#d86912', '#b88811', '#086508', '#144c93', '#1b2eaa', '#6117bf',
  ]

  const recentColors = createSignal(
    resolveInitialRecentColors(props.recentColorsName, props.recentColors)
  )

  createEffect(
    () => props.recentColorsName,
    (name) => {
      if (name) {
        const c = readRecentColorsCache(name)
        if (c != null && c.length > 0) {
          recentColors.set(c)
          return
        }
      }
      recentColors.set(props.recentColors ?? [])
    }
  )

  function addRecentColor() {
    const color = picker.hex
    if (!color) {
      return
    }
    const list = recentColors().filter(item => item !== color)
    list.unshift(color)
    if (list.length >= 7) {
      list.length = 7
    }
    recentColors.set(list)
    const name = props.recentColorsName
    if (name) {
      writeRecentColorsCache(name, list)
    }
  }

  const paletteRef = createRef<HTMLElement>()

  function bindPaletteEvent(ev: MouseEvent) {
    const update = (event: MouseEvent) => {
      const position = paletteRef.current!.getBoundingClientRect()
      const offsetX = event.clientX - position.left
      const offsetY = event.clientY - position.top

      let s = offsetX / 130 * 100
      let v = 100 - offsetY / 130 * 100

      s = Math.max(0, s)
      s = Math.min(100, s)

      v = Math.max(0, v)
      v = Math.min(100, v)
      picker.resetAlpha = false
      picker.hsv = {
        h: picker.hsv!.h,
        s,
        v
      }
      props.onChange?.(picker)
    }

    update(ev)
    listenDocumentWhileDrag(update)
  }

  const hueBarRef = createRef<HTMLDivElement>()

  function bindHueBarEvent(ev: MouseEvent) {
    const update = (event: MouseEvent) => {
      const position = hueBarRef.current!.getBoundingClientRect()
      let offsetY = event.clientY - position.top

      offsetY = Math.max(0, offsetY)
      offsetY = Math.min(100, offsetY)

      const h = 360 / 100 * offsetY

      picker.resetAlpha = false
      picker.hsv = {
        h,
        s: picker.hsv!.s,
        v: picker.hsv!.v
      }
      props.onChange?.(picker)
    }

    update(ev)
    listenDocumentWhileDrag(update)
  }

  const alphaBarRef = createRef<HTMLElement>()

  function bindAlphaEvent(ev: MouseEvent) {
    const update = (event: MouseEvent) => {
      const position = alphaBarRef.current!.getBoundingClientRect()
      let offsetX = event.clientX - position.left

      offsetX = Math.max(0, offsetX)
      offsetX = Math.min(position.width, offsetX)
      picker.rgba = {
        ...picker.rgba!,
        a: offsetX / position.width
      }
      props.onChange?.(picker)
    }

    update(ev)
    listenDocumentWhileDrag(update)
  }

  function applyFieldChange(
    model: 'H' | 'S' | 'L' | 'R' | 'G' | 'B' | 'HEX',
    raw: string
  ) {
    const updateByHSL = (h: number, s: number, l: number) => {
      picker.hex = hsl2Hex({ h, s, l })
      props.onChange?.(picker)
    }
    const updateByRGB = (r: number, g: number, b: number) => {
      picker.hex = rgb2Hex({ r, g, b })
      props.onChange?.(picker)
    }
    if (model === 'HEX') {
      if (/^#(([0-9a-f]){3}){1,2}$/i.test(raw)) {
        picker.hex = raw
        props.onChange?.(picker)
      }
      return
    }
    if (raw.trim() === '') {
      return
    }
    const n = Number(raw)
    if (Number.isNaN(n)) {
      return
    }
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
    const { h, s, l } = picker.hsl!
    const { r, g, b } = picker.rgb!
    switch (model) {
      case 'H':
        updateByHSL(clamp(n, 0, 360), s, l)
        break
      case 'S':
        updateByHSL(h, clamp(n, 0, 100), l)
        break
      case 'L':
        updateByHSL(h, s, clamp(n, 0, 100))
        break
      case 'R':
        updateByRGB(clamp(n, 0, 255), g, b)
        break
      case 'G':
        updateByRGB(r, clamp(n, 0, 255), b)
        break
      case 'B':
        updateByRGB(r, g, clamp(n, 0, 255))
        break
    }
  }

  const paletteCloseTick = createSignal(0)

  function closePaletteDropdown() {
    paletteCloseTick.set(paletteCloseTick() + 1)
  }

  function selected() {
    props.onSelected?.(picker)
    addRecentColor()
    closePaletteDropdown()
  }

  function bindColorOptionsEvent(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (!target.hasAttribute('data-color')) {
      return
    }
    const c = target.getAttribute('data-color')!
    if (c === 'unknown') {
      return
    }
    if (/^rgba/.test(c)) {
      picker.rgba = parseCss(c) as ColorRGBA
    } else {
      picker.hex = c
    }
    props.onSelected?.(picker)
    addRecentColor()
  }

  return () => (
    <div
      onMousedown={(ev: MouseEvent) => {
        ev.stopPropagation()
      }}
      class="vfui-color-picker"
    >
      <div class="vfui-color-picker__preset" onClick={bindColorOptionsEvent}>
        <div class="vfui-color-picker__swatches vfui-color-picker__swatches--row-main">
          {
            mainColors.map((color) => {
              const hsl = (any2Hsl(color) || {}) as ColorHSL
              return (
                <div
                  data-color={color}
                  class={{
                    'vfui-color-picker__swatch--current': hsl.l === picker.hsl?.l
                      && hsl.s === picker.hsl?.s
                      && hsl.h === picker.hsl?.h
                  }}
                  style={{ background: color }}
                >
                </div>
              )
            })
          }
        </div>
        <div class="vfui-color-picker__swatches vfui-color-picker__swatches--row-colors">
          {
            colors.map((color) => {
              return (
                <div data-color={color} style={{ background: color }}>
                </div>
              )
            })
          }
        </div>
        <div class="vfui-color-picker__recent-label">常用颜色</div>
        <div class="vfui-color-picker__swatches vfui-color-picker__swatches--row-recent">
          {
            Array.from({ length: 7 }).map((_, index) => {
              const rec = recentColors()
              const color = rec[index] || ''
              return (
                <div data-color={color || 'unknown'} style={{ background: color }}>
                </div>
              )
            })
          }
        </div>
        <div class="vfui-color-picker__row">
          <div class="vfui-color-picker__swatches">
            <div data-color=""></div>
          </div>
          <Dropdown
            trigger="click"
            closeTick={paletteCloseTick}
            orientation="horizontal"
            horizontalAlign="right"
            horizontalPanelAlign="middle"
            gap={8}
            getContainer={props.getContainer}
            dropdown={(
              <div
                class="vfui-color-picker__menu"
                onMousedown={(ev: MouseEvent) => {
                  ev.stopPropagation()
                }}
              >
                <div class="vfui-color-picker__viewer">
                  <div class="vfui-color-picker__viewer-left">
                    <div
                      class={[
                        'vfui-color-picker__palette',
                        { 'vfui-color-picker__palette--empty': picker.empty }
                      ]}
                      style={{
                        background: picker.empty
                          ? ''
                          : `linear-gradient(to right, #fff, hsl(${picker.hsv?.h}, 100%, 50%))`
                      }}
                      ref={paletteRef}
                      onMousedown={bindPaletteEvent}
                    >
                      <div
                        class="vfui-color-picker__palette-point"
                        style={{
                          left: `calc(${picker.hsv?.s}% - 6px)`,
                          top: `calc(${100 - (picker.hsv?.v || 0)}% - 6px)`
                        }}
                      >
                      </div>
                    </div>
                    <div class="vfui-color-picker__alpha">
                      <div
                        class="vfui-color-picker__alpha-pointer"
                        style={{
                          left: picker.empty ? '100%' : `${(picker.rgba?.a || 0) * 100}%`
                        }}
                      >
                      </div>
                      <div
                        class="vfui-color-picker__alpha-bar"
                        style={{
                          background: picker.empty
                            ? ''
                            : `linear-gradient(to right, transparent, ${picker.hex})`
                        }}
                        onMousedown={bindAlphaEvent}
                        ref={alphaBarRef}
                      >
                      </div>
                    </div>
                  </div>
                  <div class="vfui-color-picker__viewer-right">
                    <div class="vfui-color-picker__tools">
                      <div class="vfui-color-picker__value-preview">
                        <div
                          class="vfui-color-picker__value-swatch"
                          style={{
                            background: picker.empty
                              ? ''
                              : `rgba(${picker.rgba?.r}, ${picker.rgba?.g}, ${picker.rgba?.b}, ${picker.rgba?.a})`
                          }}
                        >
                        </div>
                      </div>
                      <div class="vfui-color-picker__hue" ref={hueBarRef} onMousedown={bindHueBarEvent}>
                        <div
                          class="vfui-color-picker__hue-pointer"
                          style={{
                            top: `calc(${(picker.hsv?.h || 0) / 360 * 100}% - 4px)`
                          }}
                        >
                        </div>
                      </div>
                    </div>
                    <div class="vfui-color-picker__alpha-label">
                      {Number((picker.rgba?.a ?? 0).toFixed(2))}
                    </div>
                  </div>
                </div>
                <div class="vfui-color-picker__inputs">
                  <div class="vfui-color-picker__hsl">
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">H</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.hsl?.h ?? 0)}
                        onChange={v => applyFieldChange('H', v)}
                      />
                    </div>
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">S</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.hsl?.s ?? 0)}
                        onChange={v => applyFieldChange('S', v)}
                      />
                    </div>
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">L</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.hsl?.l ?? 0)}
                        onChange={v => applyFieldChange('L', v)}
                      />
                    </div>
                  </div>
                  <div class="vfui-color-picker__rgb">
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">R</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.rgb?.r ?? 0)}
                        onChange={v => applyFieldChange('R', v)}
                      />
                    </div>
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">G</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.rgb?.g ?? 0)}
                        onChange={v => applyFieldChange('G', v)}
                      />
                    </div>
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">B</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="number"
                        size="small"
                        block
                        value={String(picker.rgb?.b ?? 0)}
                        onChange={v => applyFieldChange('B', v)}
                      />
                    </div>
                  </div>
                  <div class="vfui-color-picker__hex">
                    <div class="vfui-color-picker__input-cell">
                      <span class="vfui-color-picker__input-infix">HEX</span>
                      <Input
                        class="vfui-color-picker__field"
                        type="text"
                        size="small"
                        block
                        value={picker.hex ?? ''}
                        onChange={v => applyFieldChange('HEX', v)}
                      />
                    </div>
                  </div>
                </div>
                <div class="vfui-color-picker__actions">
                  <Button
                    class="vfui-color-picker__submit-button"
                    type="primary"
                    size="small"
                    block
                    htmlType="button"
                    onClick={selected}
                  >
                    确定
                  </Button>
                </div>
              </div>
            )}
          >
            <button
              type="button"
              class="vfui-color-picker__to-palette"
            >调色盘
              <svg
                class="vfui-color-picker__icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path transform="rotate(180, 512, 512)" d="M497.92 165.12L422.4 89.6 0 512l422.4 422.4 75.52-75.52L151.04 512z" />
              </svg>
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
