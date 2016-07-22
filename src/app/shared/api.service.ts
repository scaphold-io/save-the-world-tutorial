import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import {
  Angular2Apollo,
  Apollo
} from 'angular2-apollo';
import client from '../client';

@Apollo({
  client,
  queries(context) {
    return {
      data: {
        query: gql`
          query AllDonations($first: Int, $after: String, $last: Int, $before: String) {
            viewer {
              allDonations(first: $first, after: $after, last: $last, before: $before) {
                edges {
                  node {
                    id
                    description
                    amount
                    createdAt
                    charity {
                      name
                      mission
                      url
                      imageUrl
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          }
        `,
        variables: {
          first: context.pagination.donations.first,
          after: context.pagination.donations.after,
          last: context.pagination.donations.last,
          before: context.pagination.donations.before
        },
        forceFetch: true,
        returnPartialData: true,
        pollInterval: 1000
      }
    };
  }
})
@Injectable()
export class ApiService {

    public data: any;
    private pagination : any = {
        donations: {
            first: 10,
            after: null,
            last: null,
            before: null
        }
    }

    constructor(private apollo: Angular2Apollo) {

    }

    public allDonations : any = this.apollo.watchQuery({
      query: gql`
        query getPosts($tag: String) {
          posts(tag: $tag) {
            title
          }
        }
      `,
      variables: {
        tag: '1234'
      }
    });
}