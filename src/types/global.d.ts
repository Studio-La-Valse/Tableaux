export { } // Prevents TS from treating this as a script

// These widen the platform types to avoid TS friction with experimental APIs.
declare global {
  // Widen the PermissionName type to include 'local-fonts'
  type PermissionName = 'geolocation' | 'notifications' | 'push' | 'midi' | 'camera' | 'microphone' | 'speaker' | 'device-info' | 'background-sync' | 'bluetooth' | 'persistent-storage' | 'ambient-light-sensor' | 'accelerometer' | 'gyroscope' | 'magnetometer' | 'clipboard-read' | 'clipboard-write' | 'local-fonts'

  // Optional: Window API for Local Font Access
  type Window = {
    queryLocalFonts?: () => Promise<ReadonlyArray<LocalFontData>>
  }

  type Window = {
    // Experimental Local Font Access API
    queryLocalFonts?: () => Promise<ReadonlyArray<LocalFontData>>
  }

  type Navigator = {
    permissions?: Permissions // may be absent
    userActivation?: { isActive: boolean } // user gesture detection
  }

  // Not all TS lib versions include 'local-fonts' in PermissionName.
  type LocalFontsPermissionName = 'local-fonts' | PermissionName

  type PermissionDescriptor = {
    name: LocalFontsPermissionName
  }

  // An overload that accepts the experimental local-fonts descriptor.
  type Permissions = {
    query: (permissionDesc: { name: 'local-fonts' }) => Promise<PermissionStatus>
  }
}

// Minimal shape for Local Font Access results.
export type LocalFontData = {
  postscriptName?: string
  fullName?: string
  family?: string
  style?: string
  blob?: () => Promise<Blob>
}
