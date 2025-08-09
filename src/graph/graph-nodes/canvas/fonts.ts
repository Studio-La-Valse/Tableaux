import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Fonts')
export class Fonts extends GraphNode {
  private fonts

  private fontList: Set<string> = new Set<string>()

  constructor(id: string, path: string[]) {
    super(id, path)

    this.fonts = this.registerStringOutput('Fonts')
  }

  public onInitialize(): void {
    super.onInitialize()

    this.find()
      .then((v) => v.forEach((w) => this.fontList.add(w)))
      .then(() => this.arm())
      .then(() => this.complete())
      .catch((e) => alert(e))
  }

  protected async solve(): Promise<void> {
    this.fontList.forEach((v) => this.fonts.next(v))
  }

  private async find(): Promise<Set<string>> {
    const result = new Set<string>()

    // SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return result
    }

    // If Local Font Access is available, try to use it first
    if (typeof window.queryLocalFonts === 'function') {
      try {
        const perm = await this.queryLocalFontsPermissionSafe()

        // If permission is denied and we’re not in a user-gesture, skip calling to avoid noisy errors
        const hasUserGesture = Boolean(navigator?.userActivation?.isActive)
        if (perm === 'denied' && !hasUserGesture) {
          return this.loadFallbackFonts()
        }

        // Attempt to enumerate local fonts (may prompt the user)
        const fonts = await window.queryLocalFonts()
        fonts
          .map(
            (fontData) => fontData.fullName ?? fontData.postscriptName ?? fontData.family ?? null,
          )
          .filter((v) => v !== null)
          .forEach((v) => result.add(v))

        return result
      } catch {
        // Permission blocked or other runtime issue — fall back gracefully
        return this.loadFallbackFonts()
      }
    }

    // If API not available, use fallbacks
    return this.loadFallbackFonts()
  }

  // Query the 'local-fonts' permission safely across browsers.
  private async queryLocalFontsPermissionSafe(): Promise<PermissionState | 'unknown'> {
    try {
      if (!navigator?.permissions?.query) return 'unknown'
      // Some TS libs don’t include 'local-fonts' in PermissionName, hence the cast.
      const status = await navigator.permissions.query({
        name: 'local-fonts',
      })
      return status.state
    } catch {
      return 'unknown'
    }
  }

  // Fallback pipeline:
  // 1) Emit any fonts known to the page via CSS Font Loading API (document.fonts)
  // 2) Detect presence of common system fonts with width-measurement
  // 3) If still empty, emit generic families as a last resort
  private loadFallbackFonts(): Set<string> {
    const emitted = new Set<string>()

    // 1) Fonts already known/loaded in the page (FontFaceSet)
    const set = document?.fonts as FontFaceSet | undefined
    if (set && typeof set.forEach === 'function') {
      // FontFaceSet is iterable; not all TS lib versions type it as such.
      try {
        for (const ff of set as unknown as Iterable<FontFace>) {
          const fam = ff?.family
          if (typeof fam === 'string') {
            const clean = fam.replace(/["']/g, '').trim()
            if (clean && !emitted.has(clean)) {
              emitted.add(clean)
            }
          }
        }
      } catch {
        // Some engines exhibit iteration quirks; fall through
      }
    }

    // 2) Detect common system fonts heuristically
    const commonCandidates = [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Times',
      'Georgia',
      'Verdana',
      'Trebuchet MS',
      'Tahoma',
      'Courier New',
      'Courier',
      'Consolas',
      'Monaco',
      'Palatino Linotype',
      'Book Antiqua',
      'Lucida Sans Unicode',
      'Lucida Grande',
      'Segoe UI',
      'Calibri',
      'Cambria',
      'Garamond',
      'Franklin Gothic Medium',
      'Gill Sans',
      'Impact',
      'Futura',
      'Optima',
      'Rockwell',
      'Didot',
    ]

    const detected = this.detectInstalledFonts(commonCandidates)
    for (const name of detected) {
      if (!emitted.has(name)) {
        emitted.add(name)
        this.fonts.next(name)
      }
    }

    // 3) Minimal safe list if we still have nothing
    if (emitted.size === 0) {
      for (const generic of [
        'system-ui',
        'sans-serif',
        'serif',
        'monospace',
        'cursive',
        'fantasy',
        'emoji',
        'math',
        'fangsong',
      ]) {
        emitted.add(generic)
      }
    }

    return emitted
  }

  // Width-measurement detection of system fonts against base families
  private detectInstalledFonts(candidates: string[]): string[] {
    if (typeof document === 'undefined' || !document.body) return []

    const testString = 'mmmmmmmmmmlliWWWWW' // mix of narrow/wide glyphs
    const testSize = '72px'
    const bases = ['monospace', 'sans-serif', 'serif'] as const

    const span = document.createElement('span')
    span.textContent = testString
    span.style.position = 'absolute'
    span.style.left = '-9999px'
    span.style.top = '0'
    span.style.fontSize = testSize
    span.style.lineHeight = 'normal'
    span.style.margin = '0'
    span.style.padding = '0'
    span.style.whiteSpace = 'nowrap'
    document.body.appendChild(span)

    // Measure base widths
    const baseWidths = new Map<string, number>()
    for (const base of bases) {
      span.style.fontFamily = base
      baseWidths.set(base, span.getBoundingClientRect().width)
    }

    const available: string[] = []
    for (const candidate of candidates) {
      let isAvailable = false
      for (const base of bases) {
        span.style.fontFamily = `"${candidate}", ${base}`
        const width = span.getBoundingClientRect().width
        // Heuristic: if width differs from the base family, the candidate likely applied.
        if (Math.abs(width - (baseWidths.get(base) ?? 0)) > 0.1) {
          isAvailable = true
          break
        }
      }
      if (isAvailable) available.push(candidate)
    }

    span.remove()
    return available
  }
}
