type React = import('react')

// global.d.ts
export {}

declare global {
  interface Window {
    ship?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'urbit-sigil': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & import('./types/sigil').SigilProps,
        HTMLElement
      >
    }
  }
}
