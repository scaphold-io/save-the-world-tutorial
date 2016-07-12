import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Charity } from './charity.component';
import {AuthService} from '../shared';
import {DropTarget} from 'a2-file-drop/src/drop-target';

@Component({
  selector: 'charity-form',
  templateUrl: './charity.form.component.html',
  styleUrls: ['./charity.form.component.scss'],
  directives: [DropTarget]
})
export class CharityFormComponent implements OnInit {

    auth: AuthService;
    charity: Charity;

    constructor(auth: AuthService) {
        // Do stuff
        this.auth = auth;
        this.charity = new Charity(null, null, null, null, null);
    }

    ngOnInit() {}

    onSelected() {}
}
