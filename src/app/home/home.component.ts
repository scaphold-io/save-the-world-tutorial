import { Component, OnInit } from '@angular/core';
import {
  Angular2Apollo,
  Apollo
} from 'angular2-apollo';
import gql from 'graphql-tag';
import has = require('lodash.has');
import {DonationFormComponent, DonationListComponent} from '../donation';
import {AuthService} from '../shared';
import client from '../client';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  directives: [
    MD_CARD_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_GRID_LIST_DIRECTIVES,
    DonationFormComponent,
    DonationListComponent
  ]
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService) {
    this.auth = auth;
  }

  ngOnInit() {
    // Do stuff after the component template is done loading.
  }
}
