import { BaseEmbeddingSource, processMdxForSearch } from "../utils"
import { incidentsApi } from "./client"
import { Incident } from "./types"

export class StatusPageEmbeddingSource extends BaseEmbeddingSource {
    type = 'markdown'

    constructor(source: string, public incident: Incident) {  
      super(source, incident.id, incident.components[0].name)
    }
  
    async load() {
      const contents = `
        # ${this.incident.name}
        There is an incident affecting ${this.incident.components.length} components.
        Which are:
        ${this.incident.components.map((component) => `- ${component.name}`).join('\n')}
        The status is ${this.incident.status}.
        ${this.incident.incident_updates.map((update) => `
          - ${update.created_at}
          ${update.body}
        `).join('\n')}
      `
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

    static async getAll(): Promise<StatusPageEmbeddingSource[]> {
      if (!process.env.STATUSPAGE_PAGE_ID || !process.env.STATUSPAGE_API_KEY) {
        console.debug(`Skipping StatusPageEmbeddingSource.getAll() because STATUSPAGE_PAGE_ID or STATUSPAGE_API_KEY is not set`)
        return []
      }

      const incidents = await incidentsApi.getIncidents()
      return incidents.map((incident) => new StatusPageEmbeddingSource('statuspage', incident))
    }
  }
