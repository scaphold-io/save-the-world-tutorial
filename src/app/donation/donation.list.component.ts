import { Component, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { Apollo } from 'angular2-apollo';
import client from '../client';
import gql from 'graphql-tag';
import has = require('lodash.has');

@Component({
    selector: 'donation-list',
    templateUrl: './donation.list.component.html',
    styleUrls: ['./donation.list.component.scss'],
    directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})
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
                    first: context.first,
                    after: context.after,
                    last: context.last,
                    before: context.before
                },
                forceFetch: false,
                returnPartialData: true,
                pollInterval: 10000
            }
        };
    }
})
export class DonationListComponent implements OnInit {

    data: any;

    // pagination
    defaultPageSize: number = 6;
    first: number = this.defaultPageSize;
    last: number = null;
    after: string = null;
    before: string = null;

    constructor() {
        // Do stuff
    }

    ngOnInit() {
    }

    getPreviousPage() {
        const mayHavePreviousPage = has(this.data, 'viewer.allDonations.pageInfo')
            && this.data.viewer.allDonations.pageInfo.hasPreviousPage
            || this.last === null;
        if (mayHavePreviousPage) {
            const edgeCount = this.data.viewer.allDonations.edges.length;
            const beforeCursor = (edgeCount > 0) ? this.data.viewer.allDonations.edges[0]['cursor'] : null;
            this.before = beforeCursor;
            this.last = this.defaultPageSize;
            this.after = null;
            this.first = null;
        }
    }

    /**
     * If pageInfo says we have a next page OR first is null then try to grab a next page.
     * We have the check for this.first === null due a contraint in the relay spec for connections.
     * If first is not set in a request then pageInfo.hasNextPage is always false.
     * See https://facebook.github.io/relay/graphql/connections.htm for more info 
     */
    getNextPage() {
        const mayHaveNextPage = has(this.data, 'viewer.allDonations.pageInfo')
            && this.data.viewer.allDonations.pageInfo.hasNextPage
            || this.first === null;
        if (mayHaveNextPage) {
            const edgeCount = this.data.viewer.allDonations.edges.length;
            const afterCursor = (edgeCount > 0) ? this.data.viewer.allDonations.edges[edgeCount - 1]['cursor'] : null;
            this.after = afterCursor;
            this.first = this.defaultPageSize;
            this.before = null;
            this.last = null;
        }
    }
}
