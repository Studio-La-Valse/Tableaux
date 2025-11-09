const PATH_PART_REGEX = /^[\p{L}0-9 _\-()[\]{}]+$/u

export type RawPathResult = {
  raw: string
  parts: string[] // raw path segments (trimmed)
  errors: string[]
}

export function sanitizeRawNodePath(raw: string): RawPathResult {
  const errors: string[] = []

  // Trim external whitespace and collapse repeated slashes
  let cleaned = raw.trim().replace(/\/+/g, '/')

  // Detect and warn about trailing slash
  if (cleaned.endsWith('/')) {
    errors.push('Node path may not end with \'/\'.')
    cleaned = cleaned.replace(/\/+$/, '')
  }

  // Split into trimmed parts
  const parts = cleaned
    .split('/')
    .map(p => p.trim())
    .filter(p => p.length > 0)

  if (parts.length === 0) {
    errors.push('Node path cannot be empty.')
  }

  return { raw, parts, errors }
}

export type PartValidationResult = {
  original: string
  sanitized: string
  errors: string[]
}

export function validateNodePathPart(part: string): PartValidationResult {
  const errors: string[] = []

  const trimmed = part.trim()
  if (!trimmed) {
    errors.push('Path segment cannot be empty.')
    return { original: part, sanitized: '', errors }
  }

  if (!PATH_PART_REGEX.test(trimmed)) {
    errors.push(`Invalid characters in '${part}'. Only letters A-Z are allowed.`)
  }

  return {
    original: part,
    sanitized: trimmed,
    errors,
  }
}

export type FullPathValidation = {
  sanitized: string[]
  errors: string[]
}

export function validateFullNodePath(raw: string): FullPathValidation {
  const rawResult = sanitizeRawNodePath(raw)
  const allErrors = [...rawResult.errors]
  const sanitizedParts: string[] = []

  for (const part of rawResult.parts) {
    const { sanitized, errors } = validateNodePathPart(part)
    sanitizedParts.push(sanitized)
    allErrors.push(...errors)
  }

  return { sanitized: sanitizedParts, errors: allErrors }
}

export type PartsValidationResult = {
  parts: string[]
  sanitized: string[]
  errors: string[]
}

export function validateNodePathParts(parts: string[]): PartsValidationResult {
  const errors: string[] = []
  const sanitized: string[] = []

  if (parts.length === 0) {
    return {
      parts,
      sanitized: [],
      errors: ['Node path cannot be empty.'],
    }
  }

  for (const part of parts) {
    const result = validateNodePathPart(part)
    sanitized.push(result.sanitized)
    errors.push(...result.errors)
  }

  return {
    parts,
    sanitized,
    errors,
  }
}
