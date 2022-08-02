import {gql} from 'apollo-angular'

const METRICS_USERS = gql`
{
  metrics(names: "users") {
    count
    name
    history {
      key
      value
    }
  }
}`;

const METRICS_PROPOSALS = gql`
{
  metrics(names: "proposals") {
    count
    name
    history {
      key
      value
    }
  }
}`

const METRICS_PARTICIPATORY_PROCESSES = gql`
{
  metrics(names: "participatory_processes") {
    count
    name
    history {
      key
      value
    }
  }
}`

const METRICS_COMMENTS = gql`
{
  metrics(names: "comments") {
    count
    name
    history {
      key
      value
    }
  }
}`

export {METRICS_USERS, METRICS_PROPOSALS, METRICS_PARTICIPATORY_PROCESSES, METRICS_COMMENTS}
