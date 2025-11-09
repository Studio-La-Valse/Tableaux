import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import { formatCtx, type Font } from '@/geometry/font';

@GraphNodeType('Canvas', 'Fonts')
export class Fonts extends GraphNode {
  private fonts;

  constructor(modelId: string) {
    super(modelId);

    this.fonts = this.registerObjectOutput<Font>('Fonts');
  }

  public onInitialize(): void {
    super.onInitialize();
  }

  protected async solve(): Promise<void> {
    let result: Font[] = [];
    if (result.length === 0) {
      result = await find();
    }

    if (result.length === 0) {
      result = loadDocumentFonts();
    }

    if (result.length === 0) {
      result = loadCommonCandidates();
    }

    if (result.length === 0) {
      result = loadFallbackFonts();
    }

    result.forEach((v) => this.fonts.next(v));
  }
}

async function find(): Promise<Font[]> {
  const result: Font[] = [];

  // SSR safety
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return result;
  }

  // If Local Font Access is available, try to use it first
  if (typeof window.queryLocalFonts === 'function') {
    try {
      const perm = await queryLocalFontsPermissionSafe();

      // If permission is denied and we’re not in a user-gesture, skip calling to avoid noisy errors
      const hasUserGesture = Boolean(navigator?.userActivation?.isActive);
      if (perm === 'denied' && !hasUserGesture) {
        return [];
      }

      // Attempt to enumerate local fonts (may prompt the user)
      const fonts = await window.queryLocalFonts();
      fonts
        .map((v) => {
          const style = v.style === 'regular' ? undefined : v.style;
          return {
            family: v.family,
            fullName: v.fullName,
            postscriptName: v.postscriptName,
            style,
          };
        })
        .forEach((v) => {
          if (!v.family) return;
          result.push({
            family: v.family,
            fullName: v.fullName,
            postscriptName: v.postscriptName,
            style: v.style,
          });
        });

      return result.filter((v) => isInstalled(v));
    } catch {
      // Permission blocked or other runtime issue — fall back gracefully
      return [];
    }
  }

  // If API not available, use fallbacks
  return [];
}

// Query the 'local-fonts' permission safely across browsers.
async function queryLocalFontsPermissionSafe(): Promise<PermissionState | 'unknown'> {
  try {
    if (!navigator?.permissions?.query) return 'unknown';
    // Some TS libs don’t include 'local-fonts' in PermissionName, hence the cast.
    const status = await navigator.permissions.query({
      name: 'local-fonts',
    });
    return status.state;
  } catch {
    return 'unknown';
  }
}

function loadDocumentFonts(): Font[] {
  const result: Font[] = [];

  // 1) Fonts already known/loaded in the page (FontFaceSet)
  const set = document?.fonts as FontFaceSet | undefined;
  if (set && typeof set.forEach === 'function') {
    // FontFaceSet is iterable; not all TS lib versions type it as such.
    try {
      for (const ff of set as unknown as Iterable<FontFace>) {
        const fam = ff?.family;
        if (typeof fam === 'string') {
          const family = fam.replace(/["']/g, '').trim();
          result.push({ family });
        }
      }
    } catch {
      // Some engines exhibit iteration quirks; fall through
    }
  }

  return result.filter((v) => isInstalled(v));
}

function loadCommonCandidates(): Font[] {
  const result: Font[] = [];

  const commonStyles: (string | undefined)[] = [undefined, 'Bold', 'Italic'];

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
  ];

  for (const family of commonCandidates) {
    for (const style of commonStyles) {
      result.push({ family, style });
    }
  }

  return result.filter((v) => isInstalled(v));
}

// Fallback pipeline:
// 1) Emit any fonts known to the page via CSS Font Loading API (document.fonts)
// 2) Detect presence of common system fonts with width-measurement
// 3) If still empty, emit generic families as a last resort
function loadFallbackFonts(): Font[] {
  const result: Font[] = [];

  for (const family of [
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
    result.push({ family });
  }

  return result.filter((v) => isInstalled(v));
}

// Width-measurement detection of system fonts against base families
function isInstalled(font: Font): boolean {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error();

  const format = formatCtx(font, 16);
  ctx.font = format;

  const annoyingDefaultFallback = '10px sans-serif';
  return ctx.font != annoyingDefaultFallback;
}
