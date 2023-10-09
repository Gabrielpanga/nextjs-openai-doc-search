import { basename, dirname, join } from 'path'
import { BaseEmbeddingSource, WalkEntry, processMdxForSearch } from './utils'
import { readdir, readFile, stat } from 'fs/promises'

const ignoredFiles = ['pages/404.mdx']

async function walk(dir: string, parentPath?: string): Promise<WalkEntry[]> {
  const immediateFiles = await readdir(dir)

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file)
      const stats = await stat(path)
      if (stats.isDirectory()) {
        // Keep track of document hierarchy (if this dir has corresponding doc file)
        const docPath = `${basename(path)}.mdx`

        return walk(
          path,
          immediateFiles.includes(docPath) ? join(dirname(path), docPath) : parentPath
        )
      } else if (stats.isFile()) {
        return [
          {
            path: path,
            parentPath,
          },
        ]
      } else {
        return []
      }
    })
  )

  const flattenedFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  )

  return flattenedFiles.sort((a, b) => a.path.localeCompare(b.path))
}

export class MarkdownEmbeddingSource extends BaseEmbeddingSource {
  type = 'markdown'

  constructor(source: string, public filePath: string, public parentFilePath?: string) {
    const path = filePath.replace(/^pages/, '').replace(/\.mdx?$/, '')
    const parentPath = parentFilePath?.replace(/^pages/, '').replace(/\.mdx?$/, '')

    super(source, path, parentPath)
  }

  async load() {
    const contents = await readFile(this.filePath, 'utf8')

    const { checksum, meta, sections } = processMdxForSearch(contents)

    this.checksum = checksum
    this.meta = meta
    this.sections = sections

    return {
      checksum,
      meta,
      sections,
    }
  }

  static async getAll(): Promise<MarkdownEmbeddingSource[]> {
    return [
      ...(await walk('docs'))
        .filter(({ path }) => /\.mdx|.md?$/.test(path))
        .filter(({ path }) => !ignoredFiles.includes(path))
        .map((entry) => new MarkdownEmbeddingSource('guide', entry.path)),
    ]
  }
}
