// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { submitTag, usernameTag, passwordTag, confirmPasswordTag, titleTag } from "./app.po";

//
// -- This is a parent command --
Cypress.Commands.add('login', (username:string, password:string) => {
  usernameTag().type(username);
  passwordTag().type(password);
  submitTag().click();
});

Cypress.Commands.add('titleH1', (title:string, heading:string) => {
  titleTag().and('eq', title);
  cy.contains('h1', heading).should('exist').and('be.visible');
});

Cypress.Commands.add('register', (username:string, password:string, confirmPassword:string) => {
  usernameTag().type(username);
  passwordTag().type(password);
  confirmPasswordTag().type(confirmPassword);
  submitTag().click();
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
