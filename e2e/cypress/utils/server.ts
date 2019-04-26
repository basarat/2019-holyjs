export function startServer() {
  let startId = 0;
  cy.server()
    .route('GET', '/api/get-all', { todos: [] })
    .route('POST', '/api/add', (_req: any) => {
      return { id: (startId++).toString() }
    })
    .route('PUT', '/api/set-all', {})
}
