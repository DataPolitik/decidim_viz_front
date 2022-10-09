import { AbstractDash } from "./abstract_dash.model"

export interface UsersByCommentsHistory extends AbstractDash{
  comments: UsersByCommentsHistoryCommentInfo[]
}

export interface UsersByCommentsHistoryCommentInfo{
  id: string,
  name: string,
  comments: number
}
