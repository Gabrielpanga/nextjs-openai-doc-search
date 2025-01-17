import axios from 'axios'

import { Incident } from './types'

export class IncidentsApi {
  private apiKey: string
  private pageId: string

  constructor() {
    const { STATUSPAGE_API_KEY = '', STATUSPAGE_PAGE_ID = '' } = process.env
    this.apiKey = STATUSPAGE_API_KEY
    this.pageId = STATUSPAGE_PAGE_ID
  }

  async getUnresolvedIncidents(): Promise<Incident[]> {
    const STATUSPAGE_API_BASE_URL = `https://api.statuspage.io/v1/pages/${this.pageId}`
    const { data } = await axios.get<Incident[]>(
      `${STATUSPAGE_API_BASE_URL}/incidents/unresolved`,
      {
        headers: {
          Authorization: `OAuth ${this.apiKey}`,
        },
      }
    )
    return data
  }
}
