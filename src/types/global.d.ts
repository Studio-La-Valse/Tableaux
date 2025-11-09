/* eslint-disable ts/consistent-type-definitions */
/* eslint-disable ts/method-signature-style */

export {} // Prevents TS from treating this as a script

// These widen the platform types to avoid TS friction with experimental APIs.
declare global {
  interface Window {
    // Experimental Local Font Access API
    queryLocalFonts?: () => Promise<ReadonlyArray<LocalFontData>>
  }

  interface Navigator {
    permissions?: Permissions // may be absent
    userActivation?: { isActive: boolean } // user gesture detection
  }

  // Not all TS lib versions include 'local-fonts' in PermissionName.
  type LocalFontsPermissionName = 'local-fonts' | PermissionName

  interface PermissionDescriptor {
    name: LocalFontsPermissionName
  }

  // An overload that accepts the experimental local-fonts descriptor.
  interface Permissions {
    query(permissionDesc: { name: 'local-fonts' }): Promise<PermissionStatus>
  }
}

// Minimal shape for Local Font Access results.
export interface LocalFontData {
  postscriptName?: string
  fullName?: string
  family?: string
  style?: string
  blob?: () => Promise<Blob>
}
