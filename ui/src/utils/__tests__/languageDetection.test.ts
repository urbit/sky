import { describe, it, expect } from 'vitest'
import { detectLanguage } from '../languageDetection'

describe('detectLanguage', () => {
  // HTML Tests
  it('should detect HTML with DOCTYPE', () => {
    const content = '<!DOCTYPE html><html><body>Hello</body></html>'
    expect(detectLanguage(content)).toBe('html')
  })

  it('should detect HTML with common tags', () => {
    const content = '<div class="container"><p>Hello</p></div>'
    expect(detectLanguage(content)).toBe('html')
  })

  // XML Tests
  it('should detect XML with declaration', () => {
    const content =
      '<?xml version="1.0" encoding="UTF-8"?><root><child>data</child></root>'
    expect(detectLanguage(content)).toBe('xml')
  })

  it('should detect XML without declaration', () => {
    const content =
      '<configuration><appSettings><add key="setting" value="value"/></appSettings></configuration>'
    expect(detectLanguage(content)).toBe('xml')
  })

  // CSS Tests
  it('should detect CSS with class selectors', () => {
    const content = '.container { padding: 20px; }'
    expect(detectLanguage(content)).toBe('css')
  })

  it('should detect CSS with media queries', () => {
    const content =
      '@media screen and (max-width: 600px) { .mobile { display: none; } }'
    expect(detectLanguage(content)).toBe('css')
  })

  // JavaScript Tests
  it('should detect JavaScript with modern syntax', () => {
    const content = 'const fn = () => { return "hello"; };'
    expect(detectLanguage(content)).toBe('javascript')
  })

  it('should detect JavaScript with class definition', () => {
    const content = 'class MyComponent extends React.Component { render() {} }'
    expect(detectLanguage(content)).toBe('javascript')
  })

  // JSON Tests
  it('should detect valid JSON objects', () => {
    const content = '{"name": "test", "value": 123}'
    expect(detectLanguage(content)).toBe('json')
  })

  it('should detect valid JSON arrays', () => {
    const content = '[1, 2, 3, {"test": true}]'
    expect(detectLanguage(content)).toBe('json')
  })

  // Markdown Tests
  it('should detect Markdown with headers', () => {
    const content = '# Title\n## Subtitle\nContent here'
    expect(detectLanguage(content)).toBe('markdown')
  })

  it('should detect Markdown with mixed syntax', () => {
    const content =
      '# Title\n\n* List item\n> Blockquote\n[Link](http://example.com)'
    expect(detectLanguage(content)).toBe('markdown')
  })

  // Edge Cases
  it('should return plaintext for ambiguous content', () => {
    const content = 'Just some regular text without any special syntax'
    expect(detectLanguage(content)).toBe('plaintext')
  })

  it('should handle empty strings', () => {
    expect(detectLanguage('')).toBe('plaintext')
  })

  // Additional Edge Cases
  describe('HTML with embedded JavaScript', () => {
    it('should detect HTML when it contains embedded JavaScript', () => {
      const content = `<!DOCTYPE html>
<html>
<body>
  <h1>Test Page</h1>
  <script>
    document.querySelector("iframe").onload = function() {
      const iframe = document.querySelector("iframe").contentWindow.document;
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "./style.css";
      iframe.head.appendChild(stylesheet);
    };
  </script>
</body>
</html>`
      expect(detectLanguage(content)).toBe('html')
    })
  })

  describe('HTML vs XML edge cases', () => {
    it('should detect HTML even with XML-like custom elements', () => {
      const content = '<custom-element><div>This is HTML</div></custom-element>'
      expect(detectLanguage(content)).toBe('html')
    })

    it('should detect XML when using namespaces', () => {
      const content =
        '<ns:root xmlns:ns="http://example.com"><ns:child>Data</ns:child></ns:root>'
      expect(detectLanguage(content)).toBe('xml')
    })

    it('should detect HTML with SVG content', () => {
      const content =
        '<div><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg></div>'
      expect(detectLanguage(content)).toBe('html')
    })
  })

  describe('JavaScript vs JSON edge cases', () => {
    it('should detect JavaScript when using object literals with functions', () => {
      const content = 'const obj = { method() { return 42; } }'
      expect(detectLanguage(content)).toBe('javascript')
    })

    it('should detect JavaScript with template literals', () => {
      const content = 'const msg = `Hello ${name}`'
      expect(detectLanguage(content)).toBe('javascript')
    })

    it('should detect JSON even with escaped quotes', () => {
      const content = '{"message": "Hello \\"world\\""}'
      expect(detectLanguage(content)).toBe('json')
    })

    it('should detect JavaScript with regex literals', () => {
      const content = 'const pattern = /^[A-Z]+$/g'
      expect(detectLanguage(content)).toBe('javascript')
    })
  })

  describe('CSS edge cases', () => {
    it('should detect CSS with nested rules', () => {
      const content = '.parent { .child { color: blue; } }'
      expect(detectLanguage(content)).toBe('css')
    })

    it('should detect CSS with complex selectors', () => {
      const content =
        'div.class[data-attr^="prefix"]:hover > span + p { color: red; }'
      expect(detectLanguage(content)).toBe('css')
    })

    it('should detect CSS with vendor prefixes', () => {
      const content =
        '.box { -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); }'
      expect(detectLanguage(content)).toBe('css')
    })
  })

  describe('Markdown edge cases', () => {
    it('should detect Markdown with inline code blocks', () => {
      const content = 'Use the `console.log()` function to debug'
      expect(detectLanguage(content)).toBe('markdown')
    })

    it('should detect Markdown with fenced code blocks', () => {
      const content = '```javascript\nconst x = 42;\n```'
      expect(detectLanguage(content)).toBe('markdown')
    })

    it('should detect Markdown with HTML content', () => {
      const content = '# Title\n<div class="custom">Mixed content</div>'
      expect(detectLanguage(content)).toBe('markdown')
    })
  })

  describe('Ambiguous content edge cases', () => {
    it('should handle text that looks like HTML but is not', () => {
      const content = 'Today I learned about <tags> in HTML'
      expect(detectLanguage(content)).toBe('plaintext')
    })

    it('should handle text with special characters', () => {
      const content = '2 * 2 = 4; {text} [in brackets] <angles>'
      expect(detectLanguage(content)).toBe('plaintext')
    })

    it('should handle text with URLs', () => {
      const content = 'Check out https://example.com/page?param=value#hash'
      expect(detectLanguage(content)).toBe('plaintext')
    })
  })
})
