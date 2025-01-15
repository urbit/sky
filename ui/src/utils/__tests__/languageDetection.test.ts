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
})
