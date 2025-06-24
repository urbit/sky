import { describe, it, expect } from 'vitest'
import { detectLanguage } from '../languageDetection'

describe('detectLanguage', () => {
  describe('Browser-compatible language detection', () => {
    it('should detect JavaScript', () => {
      const content = 'const fn = () => { return "hello"; };'
      const result = detectLanguage(content)
      expect(result).toBe('javascript')
    })

    it('should detect HTML', () => {
      const content = '<!DOCTYPE html><html><body>Hello</body></html>'
      const result = detectLanguage(content)
      expect(result).toBe('html')
    })

    it('should detect CSS', () => {
      const content = '.container { padding: 20px; }'
      const result = detectLanguage(content)
      expect(result).toBe('css')
    })

    it('should detect JSON', () => {
      const content = '{"name": "test", "value": 123}'
      const result = detectLanguage(content)
      expect(result).toBe('json')
    })

    it('should detect Markdown', () => {
      const content = '# Title\n## Subtitle\nContent here'
      const result = detectLanguage(content)
      expect(result).toBe('markdown')
    })

    it('should handle empty content', () => {
      const result = detectLanguage('')
      expect(result).toBe('plaintext')
    })

    it('should return plaintext for unrecognized content', () => {
      const content = 'Just some regular text without any special syntax'
      const result = detectLanguage(content)
      expect(result).toBe('plaintext')
    })

    it('should handle complex JavaScript', () => {
      const content =
        'class MyComponent extends React.Component { render() { return <div>Hello</div>; } }'
      const result = detectLanguage(content)
      expect(result).toBe('javascript')
    })

    it('should detect XML', () => {
      const content = '<?xml version="1.0"?><root><child>data</child></root>'
      const result = detectLanguage(content)
      expect(result).toBe('xml')
    })

    it('should handle template literals', () => {
      const content = 'const msg = `Hello ${name}`'
      const result = detectLanguage(content)
      expect(result).toBe('javascript')
    })

    it('should detect TypeScript', () => {
      const content = 'interface User { name: string; age: number; }'
      const result = detectLanguage(content)
      expect(result).toBe('typescript')
    })

    it('should detect Python', () => {
      const content = 'def hello_world():\n    print("Hello, World!")'
      const result = detectLanguage(content)
      expect(result).toBe('python')
    })

    it('should detect SQL', () => {
      const content = 'SELECT * FROM users WHERE age > 21'
      const result = detectLanguage(content)
      expect(result).toBe('sql')
    })

    it('should detect CSS with media queries', () => {
      const content =
        '@media screen and (max-width: 600px) { .mobile { display: none; } }'
      const result = detectLanguage(content)
      expect(result).toBe('css')
    })

    it('should detect Go code', () => {
      const content =
        'package main\n\nfunc main() {\n    fmt.Println("Hello")\n}'
      const result = detectLanguage(content)
      expect(result).toBe('go')
    })
  })
})
