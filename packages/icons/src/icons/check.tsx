import type { IconProps } from '../icon-base'

export function IconCheck(props: IconProps = {}) {
  return () => {
    const { size, color = 'currentColor', class: className = '' } = props
    const dim = size === undefined ? '1em' : typeof size === 'number' ? size : size
    return (
      <svg
        class={className}
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
}
