import axios from 'axios'

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
    const { data } = await axios.get<ChangelogResponse[]>(`${BASE_URL}/changelogs`, {
      headers: {
        Authorization: `Basic ${this.apiKey}`,
      },
    })
    return data
  }

  async getCategories(): Promise<Category[]> {
    const { data } = await axios.get<Category[]>(`${BASE_URL}/categories?perPage=100`, {
      headers: {
        Authorization: `Basic ${this.apiKey}`,
      },
    })
    return data
  }

  async getCategoryDocs(categorySlug: Category['slug']): Promise<CategoryDocs[]> {
    const { data } = await axios.get<CategoryDocs[]>(
      `${BASE_URL}/categories/${categorySlug}/docs`,
      {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        },
      }
    )
    return data
  }

  async getDoc(docSlug: Category['slug']): Promise<ReadmeDoc> {
    const { data } = await axios.get<ReadmeDoc>(`${BASE_URL}/docs/${docSlug}`, {
      headers: {
        Authorization: `Basic ${this.apiKey}`,
      },
    })
    return data
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
