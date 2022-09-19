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

const GET_PROPOSAL_BY_ID = gql`
query getProposalById($id: number!){
  participatoryProcesses(filter: {publishedBefore: $dateTo }) {
    id
  }
}`

const PARTICIPATORY_PROCESSES_COUNT = gql`
  query getParticipatoryProcessesCount($dateTo: String!){
    participatoryProcesses(filter: {publishedBefore: $dateTo }) {
      id
    }
}`

const USERS = gql`
query getUsers($dateFrom: String!, $dateTo: String!){
  useers(filter: {publishedSince: $dateFrom, publishedBefore: $dateTo }, order: {publishedAt: "asc"}) {
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

const USERS_COUNT = gql`
  query getUsersCount($dateTo: String!){
    users {
        id
    }
  }`


  const TEMPORAL_LIMITS_PARTICIPATORY_PROCESSES = gql`
  query getTemporalLimits{
    participatoryProcesses(order: {publishedAt: "asc"}) {
      publishedAt
    }
  }`



export {
  METRICS_USERS,
  METRICS_PROPOSALS,
  METRICS_PARTICIPATORY_PROCESSES,
  METRICS_COMMENTS,
  PARTICIPATORY_PROCESSES,
  PARTICIPATORY_PROCESSES_COUNT,
  USERS,
  USERS_COUNT,
  TEMPORAL_LIMITS_PARTICIPATORY_PROCESSES
}
