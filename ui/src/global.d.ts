type React = import('react')

export {}

declare global {
  interface Window {
    ship?: string
  }
}

namespace JSX {
  interface IntrinsicElements {
    'urbit-sigil': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & import('types/sigil').SigilProps
    >
  }
}

