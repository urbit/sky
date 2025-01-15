export const detectLanguage = (content: string): string => {
  const trimmedContent = content.trim()

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
    /(function|=>|const |let |var |import |export |class\s+\w+)/.test(
      trimmedContent
    ) ||
    /\b(if|for|while|return|async|await)\b/.test(trimmedContent)
  ) {
    return 'javascript'
  }

  // CSS detection - look for typical CSS patterns
  if (
    (trimmedContent.includes('{') &&
      (/[.#*][\w-]+\s*{/.test(trimmedContent) ||
        /@[\w-]+\s*{/.test(trimmedContent))) ||
    /@(media|keyframes|import|charset|font-face)\b/.test(trimmedContent)
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
