import type { IconProps } from '../icon-base'

export function IconArrowRight(props: IconProps = {}) {
  return () => {
    const { size = 16, color = 'currentColor', class: className = '' } = props
    return (
      <svg
        class={className}
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M416 96.004l-64 64 288 288-288 288 64 64 352-352z" />
      </svg>
    )
  }
}
