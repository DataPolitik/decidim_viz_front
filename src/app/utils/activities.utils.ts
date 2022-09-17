import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';


export function execute_activities_query(apollo_instance: Apollo, gql_to_execute: DocumentNode, parameters = {} ){
    return apollo_instance.use('futureu').watchQuery<any>({
      query: gql_to_execute,
      variables: parameters
    }).valueChanges
}

export function groupByAndCount(data: any, keys: any) {
  let finalResult = keys.map((key: string | number) => {
    return Object.values(data.reduce((result: { [x: string]: { count: number; }; }, obj: { [x: string]: any; } )=>{
      let objKey = obj[key]
      result[objKey] = result[objKey] || {key: key, count: 0, value: objKey};
      result[objKey].count += 1;
      return result
    },{}))
  })
  return finalResult;
}
