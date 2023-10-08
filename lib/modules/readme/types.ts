export interface ChangelogResponse {
  metadata: Metadata
  algolia: Algolia
  title: string
  slug: string
  body: string
  type: string
  hidden: boolean
  revision: number
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
  html: string
}

export interface Algolia {
  recordCount: number
  publishPending: boolean
  updatedAt: string
}

export interface Metadata {
  image: any[]
  title: string
  description: string
}

export type Category = CategoryDocs & {
  docs: CategoryDocs[]
}

export type CategoryDocs = {
  title: string
  slug: string
  order: number
  reference: boolean
  _id: string
  isAPI: boolean
  version: string
  project: string
  createdAt: string
  __v: number
  type: string
  id: string
  body?: string
}

export interface ReadmeDoc {
  metadata: Metadata
  api: API
  next: Next
  algolia: Algolia
  title: string
  icon: string
  updates: string[]
  type: string
  slug: string
  excerpt: string
  body: string
  order: number
  isReference: boolean
  deprecated: boolean
  hidden: boolean
  sync_unique: string
  link_url: string
  link_external: boolean
  previousSlug: string
  slugUpdatedAt: string
  revision: number
  _id: string
  pendingAlgoliaPublish: boolean
  createdAt: string
  updatedAt: string
  user: string
  category: string
  project: string
  version: string
  __v: number
  parentDoc: null
  isApi: boolean
  id: string
  body_html: string
}

export interface Algolia {
  recordCount: number
  publishPending: boolean
  updatedAt: string
}

export interface API {
  method: string
  url: string
  auth: string
  results: Results
  params: any[]
}

export interface Results {
  codes: Code[]
}

export interface Code {
  name: string
  code: string
  language: string
  status: number
}

export interface Metadata {
  image: any[]
  title: string
  description: string
}

export interface Next {
  description: string
  pages: any[]
}
