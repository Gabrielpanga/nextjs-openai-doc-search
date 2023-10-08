import got from 'got'

import { Category, CategoryDocs, ChangelogResponse, ReadmeDoc } from './types'

const BASE_URL = `https://dash.readme.com/api/v1`

export class ReadmeComApi {
  private apiKey: string

  constructor() {
    if (!process.env.README_API_KEY) {
      throw new Error(`README_API_KEY is not set`)
    }

    this.apiKey = process.env.README_API_KEY
  }

  async getChangelogs(): Promise<ChangelogResponse[]> {
    return await got
      .get(`${BASE_URL}/changelogs`, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        },
      })
      .json<ChangelogResponse[]>()
  }

  async getCategories(): Promise<Category[]> {
    return await got
      .get(`${BASE_URL}/categories?perPage=100`, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        },
      })
      .json<ChangelogResponse[]>()
  }

  async getCategoryDocs(categorySlug: Category['slug']): Promise<CategoryDocs[]> {
    return await got
      .get(`${BASE_URL}/categories/${categorySlug}/docs`, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        },
      })
      .json<ChangelogResponse[]>()
  }

  async getDoc(docSlug: Category['slug']): Promise<ReadmeDoc> {
    return await got
      .get(`${BASE_URL}/docs/${docSlug}`, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        },
      })
      .json<ReadmeDoc>()
  }

  async getAllPages(): Promise<Category[]> {
    const categories = await this.getCategories()

    for (const category of categories) {
      const docs = await this.getCategoryDocs(category.slug)
      console.log(`Found ${docs.length} docs for category ${category.title}`)
      category.docs = docs

      for (const doc of docs) {
        const { body } = await this.getDoc(doc.slug)
        doc.body = body
      }
    }

    return categories
  }
}
