// Browser-compatible language detection system
// Based on patterns used by GitHub Linguist but implemented for browser environments

interface LanguagePattern {
  extensions: string[]
  patterns: RegExp[]
  keywords?: string[]
  priority: number
}

// Language definitions with patterns
const languageDefinitions: Record<string, LanguagePattern> = {
  javascript: {
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    patterns: [
      /(?:^|\s)(const|let|var|function|class|import|export)\s/,
      /=>\s*[{(]/,
      /\b(console|window|document)\./,
      /`[^`]*\$\{[^}]*\}`/, // Template literals
      /(?:^|\s)(?:async|await)\s/,
      /\.(map|filter|reduce|forEach)\s*\(/,
      /\bReact\.(Component|createElement)\b/,
      /\breturn\s*<\w+/,
    ],
    keywords: [
      'function',
      'const',
      'let',
      'var',
      'class',
      'import',
      'export',
      'async',
      'await',
      'React',
    ],
    priority: 110,
  },

  typescript: {
    extensions: ['.ts', '.tsx'],
    patterns: [
      /:\s*(string|number|boolean|any|void|object|Array)/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /<[A-Z]\w*>/,
      /as\s+\w+/,
      /(?:public|private|protected)\s+/,
    ],
    keywords: ['interface', 'type', 'public', 'private', 'protected'],
    priority: 120,
  },

  html: {
    extensions: ['.html', '.htm'],
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /^<html\b/i,
      /<(div|span|p|h[1-6]|body|head|link|meta|script|style|nav|section|article|header|footer)\b/i,
      /<\/\w+>/,
    ],
    priority: 80,
  },

  css: {
    extensions: ['.css'],
    patterns: [
      /^[\s]*@(font-face|media|keyframes|import|charset)\b/,
      /[.#][\w-]+\s*\{/,
      /:\s*[\w-]+[^}]*;/,
      /\/\*[\s\S]*?\*\//,
      /-webkit-|-moz-|-ms-|-o-/,
    ],
    priority: 85,
  },

  json: {
    extensions: ['.json'],
    patterns: [/^\s*[{[]/, /^\s*\{[\s\S]*\}\s*$/, /^\s*\[[\s\S]*\]\s*$/],
    priority: 95,
  },

  xml: {
    extensions: ['.xml'],
    patterns: [
      /^<\?xml\s+version/i,
      /<[a-zA-Z0-9]+:[a-zA-Z0-9]+/,
      /<\w+\s+[^>]*xmlns/,
      /^<([a-zA-Z0-9]+)(\s+[^>]*)?>(.*?)<\/\1>/s,
    ],
    priority: 100,
  },

  markdown: {
    extensions: ['.md', '.markdown'],
    patterns: [
      /^#{1,6}\s+/m,
      /\*\*[^*]+\*\*/,
      /__[^_]+__/,
      /\[([^\]]+)\]\(([^)]+)\)/,
      /^[-*+]\s+/m,
      /^>\s+/m,
      /^```[\w]*$/m,
      /`[^`\n]+`/,
    ],
    priority: 75,
  },

  python: {
    extensions: ['.py'],
    patterns: [
      /^def\s+\w+\s*\(/m,
      /^class\s+\w+/m,
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /:\s*$\n\s{4,}/m,
      /__name__\s*==\s*['"]__main__['"]/,
    ],
    keywords: [
      'def',
      'class',
      'import',
      'from',
      'if',
      'elif',
      'else',
      'for',
      'while',
      'try',
      'except',
    ],
    priority: 70,
  },

  java: {
    extensions: ['.java'],
    patterns: [
      /public\s+class\s+\w+/,
      /public\s+static\s+void\s+main/,
      /import\s+java\./,
      /@Override/,
      /System\.out\.println/,
    ],
    keywords: [
      'public',
      'private',
      'protected',
      'static',
      'final',
      'class',
      'interface',
    ],
    priority: 65,
  },

  php: {
    extensions: ['.php'],
    patterns: [/^<\?php/, /\$\w+/, /echo\s+/, /function\s+\w+\s*\(/, /->/],
    keywords: ['echo', 'function', 'class', 'public', 'private', 'protected'],
    priority: 60,
  },

  ruby: {
    extensions: ['.rb'],
    patterns: [
      /^class\s+\w+/m,
      /^def\s+\w+/m,
      /^module\s+\w+/m,
      /end$/m,
      /@\w+/,
      /puts\s+/,
    ],
    keywords: ['def', 'class', 'module', 'end', 'puts', 'require'],
    priority: 55,
  },

  go: {
    extensions: ['.go'],
    patterns: [
      /^package\s+\w+/m,
      /^import\s*\(/m,
      /func\s+\w+\s*\(/,
      /var\s+\w+\s+\w+/,
      /:=/,
    ],
    keywords: ['package', 'import', 'func', 'var', 'const', 'type'],
    priority: 50,
  },

  rust: {
    extensions: ['.rs'],
    patterns: [
      /fn\s+\w+\s*\(/,
      /let\s+mut\s+/,
      /struct\s+\w+/,
      /impl\s+/,
      /use\s+/,
      /println!/,
    ],
    keywords: ['fn', 'let', 'mut', 'struct', 'impl', 'use', 'pub'],
    priority: 45,
  },

  shell: {
    extensions: ['.sh', '.bash'],
    patterns: [/^#!/, /\$\w+/, /echo\s+/, /if\s*\[/, /fi$/m],
    keywords: ['echo', 'if', 'then', 'else', 'fi', 'for', 'while'],
    priority: 40,
  },

  yaml: {
    extensions: ['.yml', '.yaml'],
    patterns: [/^[\w-]+:\s*$/m, /^[\w-]+:\s+\w+/m, /^-\s+\w+/m, /^\s*-\s*/m],
    priority: 35,
  },

  sql: {
    extensions: ['.sql'],
    patterns: [
      /SELECT\s+.*\s+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+.*\s+SET/i,
      /DELETE\s+FROM/i,
      /CREATE\s+TABLE/i,
    ],
    keywords: [
      'SELECT',
      'FROM',
      'WHERE',
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'TABLE',
    ],
    priority: 30,
  },
}

// Check if content is valid JSON
const isValidJSON = (content: string): boolean => {
  try {
    JSON.parse(content.trim())
    return true
  } catch {
    return false
  }
}

// Score a language based on pattern matches
const scoreLanguage = (content: string, language: LanguagePattern): number => {
  let score = 0

  // Check patterns
  for (const pattern of language.patterns) {
    if (pattern.test(content)) {
      score += 10
    }
  }

  // Check keywords
  if (language.keywords) {
    const words = content.toLowerCase().split(/\W+/)
    for (const keyword of language.keywords) {
      if (words.includes(keyword.toLowerCase())) {
        score += 5
      }
    }
  }

  // Boost score based on priority
  score *= language.priority / 100

  return score
}

export const detectLanguage = (content: string): string => {
  if (!content || content.trim().length === 0) {
    return 'plaintext'
  }

  const trimmedContent = content.trim()

  // Special cases with high confidence
  if (
    isValidJSON(trimmedContent) &&
    (trimmedContent.startsWith('{') || trimmedContent.startsWith('['))
  ) {
    return 'json'
  }

  // XML declaration is very specific
  if (trimmedContent.startsWith('<?xml')) {
    return 'xml'
  }

  // HTML DOCTYPE is very specific
  if (trimmedContent.startsWith('<!DOCTYPE html>')) {
    return 'html'
  }

  // Score all languages
  const scores: Array<{ language: string; score: number }> = []

  for (const [languageName, languagePattern] of Object.entries(
    languageDefinitions
  )) {
    const score = scoreLanguage(content, languagePattern)
    if (score > 0) {
      scores.push({ language: languageName, score })
    }
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  // Return the highest scoring language, or plaintext if no matches
  return scores.length > 0 ? scores[0].language : 'plaintext'
}
