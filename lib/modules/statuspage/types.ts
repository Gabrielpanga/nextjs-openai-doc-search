
type ComponentStatus =
  | 'operational'
  | 'degraded_performance'
  | 'under_maintenance'
  | 'partial_outage'
  | 'major_outage'

type IncidentImpact = 'critical' | 'maintenance' | 'major' | 'minor' | 'none'

type IncidentStatus =
  | 'investigating'
  | 'identified'
  | 'monitoring'
  | 'resolved'
  | 'scheduled'
  | 'in_progress'
  | 'verifying'
  | 'completed'

export type IncidentAffectedComponent = {
  code: string
  name: string
  old_status: ComponentStatus
  new_status: ComponentStatus
}

export type IncidentUpdate = {
  status: IncidentStatus
  body: string
  created_at: string
  wants_twitter_update: boolean
  twitter_updated_at: string | null
  updated_at: string
  display_at: string
  deliver_notifications: boolean
  tweet_id: null
  id: string
  incident_id: string
  custom_tweet: string | null
  affected_components: IncidentAffectedComponent[] | null
}

export type IncidentComponent = {
  status: ComponentStatus
  name: string
  created_at: string
  updated_at: string
  position: number
  description: null | string
  showcase: boolean
  start_date: string
  id: string
  page_id: string
  group_id: string | null
}

export type Incident = {
  name: string
  status: IncidentStatus
  created_at: string
  updated_at: string
  monitoring_at: string | null
  resolved_at: string | null
  impact: IncidentImpact
  shortlink: string
  scheduled_for: string | null
  scheduled_until: string | null
  scheduled_remind_prior: boolean
  scheduled_reminded_at: string | null
  impact_override: IncidentImpact | null
  scheduled_auto_in_progress: boolean
  scheduled_auto_completed: boolean
  metadata: Record<string, unknown>
  started_at: string
  id: string
  page_id: string
  incident_updates: IncidentUpdate[]
  postmortem_body: string | null
  postmortem_body_last_updated_at: string | null
  postmortem_ignored: boolean
  postmortem_published_at: string | null
  postmortem_notified_subscribers: boolean
  postmortem_notified_twitter: boolean
  components: IncidentComponent[]
}

/**
 * @see https://developer.statuspage.io/#operation/postPagesPageIdIncidents
 */
export type StatusPageCreateIncidentRequest = {
  name: string
  /**
   * The incident status.
   * For realtime incidents, valid values are investigating, identified, monitoring, and resolved.
   * For scheduled incidents, valid values are scheduled, in_progress, verifying, and completed.
   */
  status: IncidentStatus
  body: string
  /**
   * The incident impact.
   * This is optional because it's automatically calculated by Statuspage.
   * However if we want to specify/override this value, we can manually do so by specifying this field.
   */
  impact_override?: IncidentImpact
  /**
   * Default: true
   * Deliver notifications to subscribers if this is true.
   * If this is false, create an incident without notifying customers.
   */
  deliver_notifications: boolean
  /**
   * List of component_ids affected by this incident
   */
  component_ids: string[]
  /**
   * Map of status changes to apply to affected components
   */
  components: Record<string, ComponentStatus>
}


/**
 * @see https://developer.statuspage.io/#operation/patchPagesPageIdIncidentsIncidentId
 */
export type StatusPageUpdateIncidentRequest = Pick<
  StatusPageCreateIncidentRequest,
  | 'name'
  | 'status'
  | 'body'
  | 'impact_override'
  | 'deliver_notifications'
  | 'component_ids'
  | 'components'
>
