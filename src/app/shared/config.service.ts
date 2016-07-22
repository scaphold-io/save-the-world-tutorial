import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  env: string = "dev";

  constructor() {
    // Load custom configuration here
  }
}