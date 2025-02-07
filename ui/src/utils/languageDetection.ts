export const detectLanguage = (content: string): string => {
  const trimmedContent = content.trim()

  // First check for Markdown since we want it to have highest precedence
  if (
    // Headers (at start of line or after newline)
    /^#+ /.test(trimmedContent) ||
    /\n#+ /.test(trimmedContent) ||
    // Links
    /\[.+\]\(.+\)/.test(trimmedContent) ||
    // Emphasis/bold
    /(\*\*|__)[\w\s]+(\*\*|__)/.test(trimmedContent) ||
    // Lists (at start of line or after newline)
    /^[-*+] /.test(trimmedContent) ||
    /\n[-*+] /.test(trimmedContent) ||
    // Blockquotes (at start of line or after newline)
    /^>\s/.test(trimmedContent) ||
    /\n>\s/.test(trimmedContent) ||
    // Fenced code blocks
    /^```[\s\S]*?\n[\s\S]*?\n```/.test(trimmedContent) ||
    /\n```[\s\S]*?\n[\s\S]*?\n```/.test(trimmedContent) ||
    // Inline code (but not template literals)
    (/`[^`\n]+`/.test(trimmedContent) && !trimmedContent.includes('${')) ||
    // Tables
    /^\|[\s\S]*\|/.test(trimmedContent) ||
    // Task lists
    /^- \[ \]/.test(trimmedContent) ||
    /\n- \[ \]/.test(trimmedContent)
  ) {
    return 'markdown'
  }

  // Check for HTML at the start since it's the most specific
  if (
    trimmedContent.startsWith('<!DOCTYPE html>') ||
    trimmedContent.startsWith('<html') ||
    /<(div|span|p|h[1-6]|body|head|link|meta|script|style)\b/.test(
      trimmedContent
    )
  ) {
    return 'html'
  }

  // Check CSS first with very specific patterns
  const hasCssSelector = /^[\s]*[.#][\w-]+\s*{/.test(trimmedContent) || /^[\s]*[.#][\w-]+[\s]*{/.test(trimmedContent)
  const hasCssProperty = /:\s*[\w-]+[^}]*;/.test(trimmedContent)
  const hasCssComment = /\/\*[\s\S]*?\*\//.test(trimmedContent)
  
  if ((hasCssSelector && hasCssProperty) || (hasCssComment && /\.[^\s{]+\s*{/.test(trimmedContent))) {
    return 'css'
  }

  // Then check for JavaScript
  if (
    /(^|\s)(const|let|var|function|class|import|export)\s/.test(trimmedContent) ||
    /`[^`]*\${[^}]*}`/.test(trimmedContent) || // Template literals
    /=>\s*{/.test(trimmedContent) || // Arrow functions
    /class\s+\w+(\s+extends\s+[\w.]+)?\s*{/.test(trimmedContent) // Class definitions
  ) {
    return 'javascript'
  }

  // First check for XML since it's more specific
  if (
    trimmedContent.startsWith('<?xml') ||
    (/<([a-zA-Z0-9]+:)?[a-zA-Z0-9]+(\s+[^>]*)?>(.*?)<\/\1?[a-zA-Z0-9]+>/s.test(
      trimmedContent
    ) &&
      !/<(div|span|p|h[1-6]|body|head|link|meta|script|style)\b/.test(
        trimmedContent
      ) &&
      !trimmedContent.includes('<!DOCTYPE html>'))
  ) {
    return 'xml'
  }

  // HTML detection after XML check
  if (
    trimmedContent.startsWith('<!DOCTYPE html>') ||
    trimmedContent.startsWith('<html') ||
    /<(div|span|p|h[1-6]|body|head|link|meta|script|style)\b/.test(
      trimmedContent
    )
  ) {
    return 'html'
  }

  // JavaScript detection - check for typical JS patterns
  if (
    !trimmedContent.startsWith('```') && // Avoid matching Markdown code blocks
    // Object method definitions and arrow functions
    (/\{[\s\w]+\([^)]*\)\s*{/.test(trimmedContent) ||
      /=>\s*{/.test(trimmedContent) ||
      // Regex literals
      /(?:^|\s)\/[^/\n]+\/[gimsuy]*(?:\s|$)/.test(trimmedContent) ||
      // Control flow statements
      /(?:^|\s)(if|for|while)\s*\(/.test(trimmedContent))
  ) {
    return 'javascript'
  }

  // CSS detection - look for typical CSS patterns
  if (
    // CSS Comments
    /\/\*[\s\S]*?\*\//.test(trimmedContent) ||
    (trimmedContent.includes('{') &&
      // Basic selectors
      (/[.#*][\w-]+\s*{/.test(trimmedContent) ||
        // Complex selectors
        /[\w-]+(?:\.[^\s{]+|\[.+?\]|:[^\s{]+|\s*>\s*|\s*\+\s*|\s*~\s*)*\s*{/.test(
          trimmedContent
        ) ||
        // At-rules
        /@[\w-]+\s*{/.test(trimmedContent))) ||
    /@(media|keyframes|import|charset|font-face)\b/.test(trimmedContent) ||
    // Vendor prefixes
    /\{[^}]*-(?:webkit|moz|ms|o)-/.test(trimmedContent)
  ) {
    return 'css'
  }

  // JSON detection
  try {
    JSON.parse(trimmedContent)
    // Additional check to avoid false positives with plain numbers or booleans
    return trimmedContent.startsWith('{') || trimmedContent.startsWith('[')
      ? 'json'
      : 'plaintext'
  } catch {
    // Not valid JSON, continue checking other formats
  }

  // XML detection - check for XML declaration or typical XML structure
  if (
    trimmedContent.startsWith('<?xml') ||
    /<\?xml|<[a-zA-Z0-9]+(\s+[^>]*)?>(.*?)<\/[a-zA-Z0-9]+>/s.test(
      trimmedContent
    )
  ) {
    return 'xml'
  }

  // Markdown detection - look for common Markdown syntax
  if (
    /^#+ /.test(trimmedContent) || // Headers
    /\[.+\]\(.+\)/.test(trimmedContent) || // Links
    /(\*\*|__)[\w\s]+(\*\*|__)/.test(trimmedContent) || // Bold text
    /^[-*+] /.test(trimmedContent) || // List items
    /^>\s/.test(trimmedContent)
  ) {
    return 'markdown'
  }

  return 'plaintext'
}
