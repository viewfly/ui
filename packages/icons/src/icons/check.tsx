import { mergeIconStyle, type IconProps } from '../icon-base'

export function IconCheck(props: IconProps = {}) {
  return () => {
    const { size, class: className = '', style: userStyle } = props
    const dim: number | string = size === undefined ? '1em' : typeof size === 'number' ? size : size
    return (
      <svg
        class={className}
        style={mergeIconStyle(
          { width: dim, height: dim },
          userStyle,
        )}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
}
