/** A co-participation network, as served by /stats/comments and /stats/endorsements. Keys are user ids. */
export interface GraphResponse {
  /** Adjacency: users[a][b] is the phi weight of the edge a-b (listed under both a and b). */
  users: { [id: string]: { [id: string]: number } };
  positions: { [id: string]: [number, number] };
  usernames: { [id: string]: string };
  /** Community colour of each user, as RGB. */
  colors: { [id: string]: [number, number, number] };
  communities?: { [id: string]: number };
  modularity?: number;
}
