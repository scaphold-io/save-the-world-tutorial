import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Angular2Apollo,
  Apollo
} from 'angular2-apollo';
import gql from 'graphql-tag';
import has = require('lodash.has');
import {GraphQLResult, GraphQLError} from 'graphql';
import {AuthService} from '../shared';
import client from '../client';
import {CharityComponent, Charity} from '../charity';

// Angular Material
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';

// Our email template as a string.
import { emailTemplate } from './email.inlined.template.ts';

class CreditCard {
  constructor(
    public name: string,
    public number: string,
    public expiry: string,
    public expMonth: number,
    public expYear: number,
    public cvc: number
  ) { }
}

export class Donation {
    constructor(
        public charity: Charity,
        public description: string,
        public amount: number,
        public card: CreditCard
    ) { }
}

export class Email {
  constructor(
    public to: string[],
    public from: string,
    public subject: string,
    public text: string,
    public isHtml: boolean 
  ) {}
}

@Component({
  selector: 'donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
  directives: [MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_GRID_LIST_DIRECTIVES, CharityComponent]
})
@Apollo({
  client,
  queries(context) {
    return {
      charities: {
        query: gql`
          query AllCharities($first: Int) {
            viewer {
              allCharitys(first: $first) {
                edges {
                  node {
                    id
                    name
                    mission
                    imageUrl
                    url
                    createdAt
                    modifiedAt
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
          first: 20
        },
        returnPartialData: true,
        pollInterval: 360000
      }
    };
  },
  mutations(context) {
    return {
      createStripeToken: () => ({
        mutation: gql`
          mutation CreateCardToken($input: _CreateStripeCardTokenInput!) {
            createStripeCardToken(input: $input) {
              token {
                id
                created
                livemode
                type
                used
                card {
                  id
                  brand
                  exp_year
                } 
              }
            }
          }
        `,
        variables: {
          input: {
            card: {
              exp_month: context.donation.card.expMonth,
              exp_year: context.donation.card.expYear,
              number: context.donation.card.number.split(' ').join('').trim(),
              cvc: context.donation.card.cvc,
              name: context.donation.card.name
            }
          }
        }
      }),
      createStripeCharge: (token) => ({
        mutation: gql`
          mutation CreateStripeCharge($input: _CreateStripeChargeInput!) {
            createStripeCharge(input: $input) {
              charge {
                id
                amount
                captured
                created
                currency
                description
                status
              }
            }
          }
        `,
        variables: {
          input: {
            amount: context.donation.amount * 100,
            currency: 'USD',
            source: token,
            receipt_email: 'mlparis92@gmail.com',
            capture: true
          }
        }
      }),
      createDonation: (stripeChargeId) => ({
        mutation: gql`
          mutation CreateDonation($input: _CreateDonationInput!) {
            createDonation(input: $input) {
              changedDonation {
                id
                description
                charity {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: {
          input: {
            description: context.donation.description,
            amount: context.donation.amount * 100,
            stripeChargeId: stripeChargeId,
            charityId: context.donation.charity.id,
            userId: context.auth.user ? context.auth.user.id : ''
          }
        }
      }),
      sendEmail: (email: Email) => ({
        mutation: gql`
          mutation sendMailgunEmailQuery($email: _SendMailgunEmailInput!){
            sendMailgunEmail(input: $email) {
              id
              message
            }
          }
        `,
        variables: {
          email: email
        }
      })
    };
  }
})
export class DonationComponent implements OnInit, AfterViewInit {

  /**
   * Our @Apollo mutations
   */
  createStripeToken: () => Promise<GraphQLResult>;
  createStripeCharge: (token: string) => Promise<GraphQLResult>;
  createDonation: (stripeChageId: string) => Promise<GraphQLResult>;
  sendEmail: (email: Email) => Promise<GraphQLResult>;

  /**
   * AuthService
   */
  auth: AuthService;

  /**
   * Models.
   */
  donated: boolean = false;
  donation: Donation;
  charities: any;
  cardJS: any;
  errors: Array<GraphQLError>;

  constructor(private apollo: Angular2Apollo, auth: AuthService, private window: Window) {
    this.auth = auth;
    this.resetDonation();
  }

  resetDonation() {
    const card = new CreditCard('', '', null, null, null, null);
    const charity = new Charity(null, null, null, null, null);
    this.donation = new Donation(charity, '', 5, card);
  }

  ngOnInit() {
    // Do stuff after the data bound components are prepared
  }

  ngAfterViewInit() {
    // Do stuff after the component template is done loading.
    this.initializeCard();
  }

  initializeCard() {
    const CardJS = this.window['Card'];
    this.cardJS = new CardJS({
      // a selector or DOM element for the form where users will be entering their information
      form: '#paymentForm', // *required*

      // where you want the card to appear
      container: '.card-wrapper', // *required*

      formSelectors: {
          numberInput: '#number-input', // optional — default input[name='number']
          expiryInput: '#expiry-input', // optional — default input[name='expiry']
          cvcInput: '#cvc-input', // optional — default input[name='cvc']
          nameInput: '#name-input' // optional - defaults input[name='name']
      },

      formatting: true, // optional - default true
    });
  }

  onCharitySelected(charity: Charity) {
    this.donation.charity = charity;
  }

  handleGraphQLErrors(errors) {
    if (this.errors) {
      this.errors = errors;
      throw errors;
    }
  }

  sendReceiptEmail(donation : Donation) {
    if (this.auth.user.username) {
      const email = new Email(
        [this.auth.user.username],
        'give@scaphold.io',
        'Thank You for Donating!',
        emailTemplate,
        true
      );
      this.sendEmail(email).then(({errors, data}) => {
        console.log('Successfully sent email');
      }).catch(err => {
        console.log(`Error sending email: ${err.message}`);
      });
    }
  }

  onSubmit(event) {
    if (event) { event.preventDefault(); }
    if (!this.donation.charity.id) {
      this.errors = [new GraphQLError('Please select a charity to donate to.')];
      return;
    }
    try {
      const [month, year] = this.donation.card.expiry.split('/');
      this.donation.card.expMonth = parseInt(month, 10);
      this.donation.card.expYear = parseInt(year, 10);
      this.donation.card.number = document.querySelector('input[name=number]')['value'];
    } catch (e) {
      this.errors = [new GraphQLError(`Invalid expiry ${this.donation.card.expiry}. Expected MM/YY`)];
      return;
    }
    this.createStripeToken().then(({data, errors}: GraphQLResult) => {
      this.handleGraphQLErrors(errors);
      const token = has(data, 'createStripeCardToken.token') ? data['createStripeCardToken']['token']['id'] : null;
      return this.createStripeCharge(token);
    }).then(({data, errors}: GraphQLResult) => {
      this.handleGraphQLErrors(errors);
      const charge = has(data, 'createStripeCharge.charge') ? data['createStripeCharge']['charge'] : {};
      return this.createDonation(charge['id']);
    }).then(({errors, data}) => {
      this.handleGraphQLErrors(errors);
      this.donated = true;
      this.sendReceiptEmail(this.donation);
      this.resetDonation();
      return data;
    }).catch(err => {
      console.log(`Error donating ${err.message}`);
    });
  }
}
