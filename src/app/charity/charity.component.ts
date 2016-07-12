import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class Charity {
  constructor(
    public id: string,
    public name: string,
    public mission: string,
    public imageUrl: string,
    public url: string
  ) { }
}

@Component({
  selector: 'charity-row',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss']
})
export class CharityComponent implements OnInit {

    @Input() isSelected: boolean = false;
    @Input() charity: Charity;
    @Output() selected = new EventEmitter();

    constructor() {
        // Do stuff
    }

    ngOnInit() {}

    onSelected() {
      this.selected.next(this.charity);
    }
}
