/*
    LODASH
*/
declare module 'lodash.has' {
  import main = require('~lodash/index');
  export = main.has;
}

/*
  GRAPHQL
*/
declare module 'graphql/language/parser' {
  import { Source, ParseOptions, Document } from 'graphql';
  // XXX figure out how to directly export this method
  function parse(
      source: Source | string,
      options?: ParseOptions
  ): Document;
}

declare module 'graphql/language/printer' {
  function print(ast: any): string;
}

// declare module 'card' {
//     class CardConfig {
//         public form: string;
//         public container: string;
//         public formSelectors: any;
//         public width: number;
//         public formatting: boolean;
//         public messages: any;
//         public placeholders: any;
//         public debug: boolean;
//     }

//     export function Card(config: CardConfig) : void;
// }