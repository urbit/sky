type React = import('react');

namespace JSX {
  interface IntrinsicElements {
    'urbit-sigil': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & import('types/sigil').SigilProps
    >;
  }
}

