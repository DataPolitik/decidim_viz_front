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

const PARTICIPATORY_PROCESSES = gql`
query getParticipatoryProcesses($dateFrom: String!, $dateTo: String!){
  participatoryProcesses(filter: {publishedSince: $dateFrom, publishedBefore: $dateTo }, order: {publishedAt: "asc"}) {
    id,
    slug,
    publishedAt,
    title {
      translations {
        text
      }
    }
  }
}`

export {METRICS_USERS, METRICS_PROPOSALS, METRICS_PARTICIPATORY_PROCESSES, METRICS_COMMENTS, PARTICIPATORY_PROCESSES}
