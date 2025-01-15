export const detectLanguage = (content: string): string => {
  const trimmedContent = content.trim()

  // First check for Markdown since we want it to have highest precedence
  if (
    // Headers (at start of line or after newline)
    /^#+ /.test(trimmedContent) || /\n#+ /.test(trimmedContent) ||
    // Links
    /\[.+\]\(.+\)/.test(trimmedContent) ||
    // Emphasis/bold
    /(\*\*|__)[\w\s]+(\*\*|__)/.test(trimmedContent) ||
    // Lists (at start of line or after newline)
    /^[-*+] /.test(trimmedContent) || /\n[-*+] /.test(trimmedContent) ||
    // Blockquotes (at start of line or after newline)
    /^>\s/.test(trimmedContent) || /\n>\s/.test(trimmedContent) ||
    // Fenced code blocks
    /^```[\s\S]*?\n[\s\S]*?\n```/.test(trimmedContent) ||
    /\n```[\s\S]*?\n[\s\S]*?\n```/.test(trimmedContent) ||
    // Inline code (but not template literals)
    (/`[^`\n]+`/.test(trimmedContent) && !trimmedContent.includes('${')) ||
    // Tables
    /^\|[\s\S]*\|/.test(trimmedContent) ||
    // Task lists
    /^- \[ \]/.test(trimmedContent) || /\n- \[ \]/.test(trimmedContent)
  ) {
    return 'markdown'
  }

  // Then check for JavaScript keywords and patterns
  if (
    /(^|\s)(const|let|var|function|class|import|export)\s/.test(trimmedContent) ||
    /`[^`]*\${[^}]*}`/.test(trimmedContent) || // Template literals with interpolation
    /=>\s*{/.test(trimmedContent) // Arrow functions
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
    (
      // Object method definitions and arrow functions
      /\{[\s\w]+\([^)]*\)\s*{/.test(trimmedContent) ||
      /=>\s*{/.test(trimmedContent) ||
      // Regex literals
      /(?:^|\s)\/[^/\n]+\/[gimsuy]*(?:\s|$)/.test(trimmedContent) ||
      // Control flow statements
      /(?:^|\s)(if|for|while)\s*\(/.test(trimmedContent)
    )
  ) {
    return 'javascript'
  }

  // CSS detection - look for typical CSS patterns
  if (
    (trimmedContent.includes('{') &&
      (
        // Basic selectors
        /[.#*][\w-]+\s*{/.test(trimmedContent) ||
        // Complex selectors
        /[\w-]+(?:\.[^\s{]+|\[.+?\]|\:[^\s{]+|\s*>\s*|\s*\+\s*|\s*~\s*)*\s*{/.test(trimmedContent) ||
        // At-rules
        /@[\w-]+\s*{/.test(trimmedContent)
      )) ||
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
