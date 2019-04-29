export function startServer() {
  cy.request('PUT', 'http://localhost:3000/api/set-all', { todos: [] })
}
