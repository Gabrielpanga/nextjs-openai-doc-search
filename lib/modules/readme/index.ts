import { BaseEmbeddingSource, processMdxForSearch } from '../utils'
import { ReadmeComApi } from './client'
import { ChangelogResponse } from './types'

export class ReadmeComEmbeddingSource extends BaseEmbeddingSource {
  type = 'markdown'

  constructor(source: string, public content: string, path: string, parentPath?: string) {
    super(source, path, parentPath)
  }

  async load() {
    const { checksum, meta, sections } = processMdxForSearch(this.content)

    this.checksum = checksum
    this.meta = meta
    this.sections = sections

    return {
      checksum,
      meta,
      sections,
    }
  }

  static async getAll(): Promise<ReadmeComEmbeddingSource[]> {
    try {
      const readmeComApi = new ReadmeComApi()
      const [changelogs, parentPages] = await Promise.all([
        readmeComApi.getChangelogs(),
        readmeComApi.getAllPages(),
      ])
      return [
        ...changelogs.map(
          (changelog) =>
            new ReadmeComEmbeddingSource(
              'readme.com',
              changelog.body,
              `changelog/${changelog.slug}`,
              'changelog'
            )
        ),
        ...parentPages
          .map((parentPage) => {
            return parentPage.docs
              .filter((doc) => !!doc.body)
              .map(
                (doc) =>
                  new ReadmeComEmbeddingSource(
                    'readme.com',
                    doc.body || '',
                    `docs/${parentPage.slug}/${doc.slug}`,
                    `docs/${parentPage.slug}`
                  )
              )
          })
          .flat(1),
      ]
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
