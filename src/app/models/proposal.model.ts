export interface ProposalResponse{
  proposals: Array<Proposal>
}

export interface Proposal{
  id: number,
  title_es: string | null,
  title_fr: string | null,
  title_en: string | null,
  endorsements: number,
  url: string,
  latitude: string,
  longitude: string,
  category: number,
  comments: number
}
