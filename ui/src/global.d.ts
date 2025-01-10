type React = import('react')

interface SigilProps {
  point: string
  size: string
  detail: string
  space: string
  background: string
  foreground: string
}

export {}

declare global {
  interface Window {
    ship?: string
    urbitID?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'urbit-sigil': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SigilProps,
        HTMLElement
      >
    }
  }
}
