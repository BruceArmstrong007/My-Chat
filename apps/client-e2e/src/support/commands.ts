// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { submitTag, usernameTag, passwordTag, confirmPasswordTag } from "./app.po";

//
// -- This is a parent command --
Cypress.Commands.add('login', (username:string, password:string) => {
  usernameTag().should('be.visible').type(username);
  passwordTag().should('be.visible').type(password);
  submitTag().should('be.visible').click();
});

Cypress.Commands.add('titleH1', (title:string, heading:string) => {
  cy.title().should('eq', title);
  cy.contains('h1', heading).should('be.visible');
});

Cypress.Commands.add('register', (username:string, password:string, confirmPassword:string) => {
  usernameTag().should('be.visible').type(username);
  passwordTag().should('be.visible').type(password);
  confirmPasswordTag().should('be.visible').type(confirmPassword);
  submitTag().should('be.visible').click();
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
