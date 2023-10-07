import got from 'got'

import {
  Incident,
} from './types'

class IncidentsApi {
  async getIncidentsPage(page: number): Promise<Incident[]> {

    const { STATUSPAGE_API_KEY, STATUSPAGE_PAGE_ID } = process.env
    const STATUSPAGE_API_BASE_URL = `https://api.statuspage.io/v1/pages/${STATUSPAGE_PAGE_ID}`
    return await got
      .get(`${STATUSPAGE_API_BASE_URL}/incidents/unresolved`, {
        searchParams: {
          page,
        },
        headers: {
          Authorization: `OAuth ${STATUSPAGE_API_KEY}`,
        },
      })
      .json<Incident[]>()
  }

  /**
   * Retrieve all Incidents from Statuspage API
   * @see https://developer.statuspage.io/#operation/getPagesPageIdIncidents
   */
  public async getIncidents(): Promise<Incident[]> {
    const incidents: Incident[] = []

    let page = 1
    let incidentsPage = await this.getIncidentsPage(page)

    while (incidentsPage.length > 0) {
      incidents.push(...incidentsPage)
      page++
      incidentsPage = await this.getIncidentsPage(page)
    }

    return incidents
  }
}

export const incidentsApi = new IncidentsApi()
