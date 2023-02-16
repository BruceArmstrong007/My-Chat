export const usernameTag = () => get('#username');
export const passwordTag = () => get('#password');
export const confirmPasswordTag = () => get('#confirmPassword');
export const submitTag = () => get('#submit');
export const titleTag = () => title();


export const get = (selector: string) => cy.get(selector).should('exist').and('be.visible');
export const title = () => cy.title().should('exist').and('be.visible');
