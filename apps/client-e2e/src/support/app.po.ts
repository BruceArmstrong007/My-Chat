export const usernameTag = () => getTag('#username');
export const passwordTag = () => getTag('#password');
export const confirmPasswordTag = () => getTag('#confirmPassword');
export const submitTag = () => getTag('#submit');
export const titleTag = () => title();


export const getTag = (selector: string) => cy.get(selector).should('exist').should('be.visible');
export const title = () => cy.title().should('exist');
