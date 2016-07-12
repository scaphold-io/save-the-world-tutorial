# Let's build a GraphQL powered Angular2 application using Apollo Client, Webpack, and Scaphold.io

## Introduction

This tutorial is going to walk you through how to build and deploy a production website using 
Angular2, Apollo Client, and Scaphold.io.


## Installation

- Clone the Angular2, Apollo Client, Webpack starter kit
    - `git clone https://github.com/scaphold-io/angular2-apollo-client-webpack-starter.git my-app`
- Install Angular2 Material
    - `npm install --save npm install --save @angular2-material/core @angular2-material/button @angular2-material/card`
    - Add angular2-material packages to `src/vendor.ts`
    ```javascript
    import '@angular2-material/core';
    import '@angular2-material/button'; 
    import '@angular2-material/card';
    import '@angular2-material/input';
    ```
    - Import the material design directives from your component files
    ```javascript
    import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
    import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
    import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
    ```
    - Inject the directives to be used in the components
    ```javascript
    directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_INPUT_DIRECTIVES]
    ```
    - Add the hammerjs typings `"hammerjs": "registry:dt/hammerjs#2.0.4+20160417130828"`
- Create the Donation component.
    - install bootstrap for a simple to use, responsive grid system
        - `npm install bootstrap-grid`
        - Require bootstrap-grid in vendor.ts `import 'bootstrap-grid'`
        - Set `* { box-sizing: border-box; }` in the app.scss file in the global style directory