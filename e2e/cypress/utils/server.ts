export function startServer() {
  let startId = 0;
  cy.server()
    .route('GET', '/api/get-all', { todos: [] })
    /** Dynamic fail https://github.com/cypress-io/cypress/issues/521  */
    .route({
      method: 'POST',
      url: '/api/add',
      response: { id: '' },
      onRequest(xhr: any) {
        debugger;
        xhr.response = {
          body: {
            id: (++startId).toString()
          }
        }
      },
      onResponse(xhr: XMLHttpRequest) {
        debugger;
        xhr.response.body = {
          id: (++startId).toString()
        }
      }
    })
    .route('PUT', '/api/set-all', {})
}
