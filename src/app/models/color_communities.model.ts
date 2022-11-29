export interface ColorCommunities{
  total: number,
  colors: ColorDataCommunities
}

interface ColorDataCommunities{
  users: Array<{[id: string]: Array<string>}>,
  proposals: Array<{[id: string | number]: Array<any>}>
}
