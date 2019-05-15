# Maintainable web application testing with cypress
> Testing how it should be

## Setup 
Open slides: 
https://docs.google.com/presentation/d/1GkosEbTLBNZM4n9g9FXDBsSTl1D2IzcHePplTZ3PRwI/edit?usp=sharing

Setup the `webapp`: 
* cd webapp
* `npm install`
* `npm start`

Setup `e2e`:
* cd e2e
* `npm install`
* `npm start`

Open up code: 
* code .

Open localhost:8080
* open http://localhost:8080

# Script 

--- SLIDE --- 

## Cypress Concepts
### Test runner 
* Show the test runner 
  * Show package.json + deps + scripts, tsconfig.json, plugins/index.js, integration/example.ts
  * `cy.visit('http://www.google.com');`
  
```ts
    cy.visit('http://www.google.com');
    cy.get('.gLFyf').type('Hello world{enter}');
 ```

### Flake resistance
* One big idea that makes it possible is the command - execution speration. 
```ts
    console.log('start');
    cy.visit('http://www.google.com');
    console.log('between');
    cy.get('.gLFyf').type('Hello world');
    console.log('end');
```
* Advantages 
  * Implicit retries. Notice the retry, and notice the error occurs in the get, not in a `.type` cannot be invoked on undefined. 
```ts
cy.get('.somethingelse').type('Hello world')
```
  * Second it allows you to write commands in a synchronous fashion even though they execute asynchronously, keeping you away from chaining hell or missed await calls.

* Also worth pointing out commands follow user interactions. E.g. `.type` inserts text like a user would do it, key by key, this also results in less flake.

### Assertions (`should` command) and its arguments
All assertions are done with the `should` command. 

```ts
    cy.visit('http://www.google.com')
    cy.get('.gLFyf').should('have.value', 'h')
```
Notice the autocomplete, and once again touch on our flake resistance notice that its actively waiting for the value to arrive at that state, and we can interact with the ui ourself in this case to show how it passes once the value is actually that.

----- SLIDE -------

## App 
* Show the app running 
  * Add, remove, mark as complete - filter. Preserved on reload.

## Test app 
Lets write our first test to see it in practice. We already have the application running on 8080 and we can test that. 

```ts
  cy.visit('http://localhost:8080');
```

* At this point writing clear dependable tests is problematic as the initial state of the applicaiton will vary depending upon the backend state.

----- SLIDE -------

### Removing backend dependency
Notice that we start with some todos in there. Its not ideal, instead we should mock out the respose from this `get-all` api. See the response we are getting right now. And lets remove it starting a cypress `server`: 

```ts
  cy.server()
    .route('GET', '/api/get-all', { todos: [] });
  // continue with cy.visit 
```
We can move it to before each
```ts
beforeEach(() => {
  cy.server().route('GET', 'http://localhost:3000/api/get-all', { todos: [] });
});
```

### Init backend dependency

If we play around with the ui we see there are calls to `POST``/add` and `PUT``/set-all`. We could start mocking all of these all well and at that point you will be re-creating your backend. So think about it for a second and you will realize that the whole objective here is to ensure that the application starts in a known good state. So what you really want is `init` the server instead of starting to mock these out. 

```ts
cy.request('PUT', 'http://localhost:3000/api/set-all', { todos: [] });
```

These are true E2E tests. 

And we can easily move it into its own file `utils/server.ts` file. And then call it in a `beforeEach` block in our tests. 

```ts
import { startServer } from "../utils/server";

beforeEach(() => {
  startServer();
});
```

----- SLIDE -------


### Creating page objects 
* Show playground to show css classes, selectors for links etc.
* `cypress/utils/page/todoPage`
* Selectors, actions.

* add to test to show 
```ts
beforeEach(() => {
  startServer();
  page.visit();  
});
```

* Test : 
```ts
cy.get(page.selectors.newTodoInput).type('Hello world{enter}');
```

* Even better:
```ts
page.addTodo('Hello world');
```

---- SLIDE: Behaviour vs. spec  ----

## Write Code
