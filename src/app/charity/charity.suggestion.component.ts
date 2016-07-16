import { Component, OnInit } from '@angular/core';
import { Charity } from './charity.component';
import {AuthService} from '../shared';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import {GraphQLResult} from 'graphql';
import { Apollo } from 'angular2-apollo';
import client from '../client';
import gql from 'graphql-tag';

class CharitySuggestion extends Charity {
    constructor(
        public name: string,
        public url: string,
        public imageUrl: string,
        public mission: string,
        public reason: string
    ) { super(null, name, mission, imageUrl, url); }
}

@Component({
  selector: 'charity-suggestion',
  templateUrl: './charity.suggestion.component.html',
  styleUrls: ['./charity.suggestion.component.scss'],
  directives: [MD_BUTTON_DIRECTIVES, MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES]
})
@Apollo({
    client,
    mutations(context) {
        return {
            createCharitySuggestion: () => ({
                mutation: gql`
                    mutation CreateCharitySuggestion($input: _CreateCharitySuggestionInput!) {
                        createCharitySuggestion(input: $input) {
                            changedCharitySuggestion {
                                id
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        name: context.charitySuggestion.name,
                        url: context.charitySuggestion.url,
                        imageUrl: context.charitySuggestion.imageUrl,
                        mission: context.charitySuggestion.mission,
                        reason: context.charitySuggestion.reason
                    }
                }
            })
        };
    }
})
export class CharitySuggestionComponent implements OnInit {

    auth: AuthService;
    charitySuggestion: CharitySuggestion;
    createCharitySuggestion: () => Promise<GraphQLResult>;
    submitted: boolean = false;

    constructor(auth: AuthService) {
        // Do stuff
        this.auth = auth;
        this.charitySuggestion = new CharitySuggestion(null, null, null, null, null);
    }

    ngOnInit() {}

    resetSubmission() {
        this.submitted = false;
        this.charitySuggestion = new CharitySuggestion(null, null, null, null, null);
    }

    onSubmit(event) {
        if (event) { event.preventDefault(); }
        this.createCharitySuggestion().then(({data, errors}) => {
            this.submitted = true;
        });
    }
}
