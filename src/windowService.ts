import {Injectable} from 'angular2/core';
import {window} from 'angular2/src/facade/browser';

@Injectable()
export class WindowService {

    constructor() { }

    get window(): Window
    {
        return window;
    }
}
