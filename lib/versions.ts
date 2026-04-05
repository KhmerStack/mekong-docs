export interface VersionEntry {
  id: string
  label: string
  beta?: boolean
}

export const VERSIONS = [
  { id: 'v1.0.0', label: 'v1.0.0', beta: false },
  { id: 'v1',     label: 'v1',     beta: true  },
] satisfies VersionEntry[]

export const LATEST_VERSION = VERSIONS[0].id
