export interface AbstractDash{
  gini: Gini
}


export interface Gini{
  value: number,
  contributions: Array<number>
}
