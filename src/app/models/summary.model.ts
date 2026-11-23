/** Headline counts from /stats/summary, computed from the imported data. */
export interface Summary {
  /** People who commented on or endorsed at least one proposal. */
  participants: number;
  proposals: number;
  comments: number;
}
