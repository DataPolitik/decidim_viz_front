import { AbstractDash } from "./abstract_dash.model"

export interface ProposalResponse extends AbstractDash{
  proposals: Array<Proposal>
}

export interface Proposal{
  id: number,
  title_es: string | null,
  title_fr: string | null,
  title_en: string | null,
  /** As originally written, in any language; never empty. */
  title?: string,
  endorsements: number,
  url: string,
  /** Decimal degrees as text; null when the proposal has no location. */
  latitude: string | null,
  longitude: string | null,
  category: number,
  comments: number,
  position: number
}
