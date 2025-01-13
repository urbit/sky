const fs = require('fs').promises
const path = require('path')

// URL of our development server
const DEV_URL = 'http://localhost:8000'

async function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png'
  }
  return mimeTypes[ext] || 'text/plain'
}

async function put(path, formData) {
  const response = await fetch(`${DEV_URL}/${path}`, {
    method: 'PUT',
    body: formData
  })
  if (!response.ok) {
    throw new Error(`PUT failed for ${path}: ${response.statusText}`)
  }
  return response
}

// Files and directories to ignore
const ignorePatterns = [
  '.DS_Store',
  'node_modules',
  '.git'
]

function shouldIgnore(pathSegment) {
  return ignorePatterns.some(pattern => pathSegment.includes(pattern))
}

async function processFile(filePath) {
  if (shouldIgnore(filePath)) {
    return
  }
  try {
    // Read the file
    const content = await fs.readFile(filePath, 'utf8')
    
    // Get relative path from namespace dir
    const relativePath = path.relative(
      path.join(__dirname, 'namespace'),
      filePath
    )
    
    // Convert path segments for the put() URL
    const urlPath = relativePath.split(path.sep)
    // Remove the file extension for the URL
    const fileName = path.basename(urlPath[urlPath.length - 1], path.extname(urlPath[urlPath.length - 1]))
    urlPath[urlPath.length - 1] = fileName
    
    const putPath = `${urlPath.join('/')}`
    
    // Create FormData and append file
    const formData = new FormData()
    const file = new File(
      [content],
      path.basename(filePath),
      { type: await getMimeType(filePath) }
    )
    formData.append('file', file)

    // PUT the file
    await put(putPath, formData)
    console.log(`Successfully uploaded ${filePath} to ${putPath}`)
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
  }
}

async function processDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) {
        continue
      }
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        await processDirectory(fullPath)
      } else {
        await processFile(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error)
  }
}

// Start processing from the namespace directory
const namespacePath = path.join(__dirname, 'namespace')
processDirectory(namespacePath)
  .then(() => console.log('Initialization complete'))
  .catch(error => console.error('Initialization failed:', error))
