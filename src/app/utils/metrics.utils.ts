import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';


export function execute_metrics_query(apollo_instance: Apollo, gql_to_execute: DocumentNode ){
    return apollo_instance.use('futureu').watchQuery<any>({
      query: gql_to_execute
    }).valueChanges
}

