export interface ColorCommunities{
  total: number,
  colors: ColorDataCommunities
}

interface ColorDataCommunities{
  users: Array<{[id: string]: Array<string>}>,
  proposals: Array<{[id: string | number]: Array<any>}>,
  /** Decidim page of each listed proposal, by colour and title; missing on older back ends. */
  urls?: {[color: string]: {[title: string]: string}}
}
