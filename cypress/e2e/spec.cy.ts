/*
  This Cypress test uses the development database. Although, there should be some tests that use the actual
  database, stubbing the data is generally prefered.
*/
describe('Cypress end-to-end test example', () => {
  it('Selects one class from the L.EIC course', () => {
    cy.visit('/')
    cy.url().should('include', '/tts/planner')
    cy.get('[data-testid="major-input"]').type("leic")
    cy.contains("L.EIC").click()
    cy.get('[type="checkbox"]').first().check()
    cy.contains("Confirmar").click()
    cy.get('[data-testid="course-picker"]').should('be.hidden')
    cy.get('[data-testid="courses-controller"]')
      .children()
      .first()
      .find("button")
      .first()
      .click()
    cy.contains("1LEIC01").click()
    cy.get(".schedule-classes").children().should('have.length', 2)
  })
})

export {}