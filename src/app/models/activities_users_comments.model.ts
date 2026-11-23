import { AbstractDash } from "./abstract_dash.model"

export interface UsersByCommentsHistory extends AbstractDash{
  comments: UsersByCommentsHistoryCommentInfo[]
}

export interface UsersByCommentsHistoryCommentInfo{
  id: string,
  name: string,
  /** Unique within a list; set by withUniqueLabels for charts. */
  label?: string,
  /** Rank in the list, used as the bar label. */
  position?: number,
  comments: number
}
