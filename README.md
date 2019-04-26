# Maintainable web application testing with cypress
> Testing how it should be

Docs / Code to an accompanying video course on cypress web application testing.

## Setup 
Setup the `webapp`: 
* cd webapp
* `npm install`
* `npm start`

Setup `e2e`:
* cd e2e
* `npm install`
* `npm start`

# Demo 

### App 
* Show the app running 
  * Add, remove, mark as complete - filter. Preserved on reload.

### Test runner 
* Show the test runner 
  * Show package.json + deps + scripts, tsconfig.json, plugins/index.js, integration/example.ts
  * `cy.visit('http://www.google.com')`

### Flake resistance
* I've mentioned that cypress tests are flake resistant. One big idea that makes it possible is the command - execution speration. 
* insert console logs, run the test, see the console logs execute immediately. So its a two step process, one step to run the test, to note down the calls to cypress as commands that need executing. Next the runner goes ahead and runs them. 
```ts
    console.log('start')
    cy.visit('http://www.google.com')
    console.log('between')
    cy.get('.gLFyf').type('Hello world')
    console.log('end')
```
* Advantages 
  * Implicit retries. Notice the retry, and notice the error occurs in the get, not in a `.type` cannot be invoked on undefined. 
```ts
cy.get('.somethingelse').type('Hello world')
```
  * Second it allows you to write commands in a synchronous fashion even though they execute asynchronously, keeping you away from chaining hell or missed await calls.

Also worth pointing out that the commands follow user interactions. E.g. `.type` inserts text like a user would do it, key by key, this also results in less flake.

### Assertions (`should` command) and its arguments
All assertions are done with the `should` command. 

```ts
    cy.visit('http://www.google.com')
    cy.get('.gLFyf').should('have.value', 'h')
```
Notice the autocomplete, and once again touch on our flake resistance notice that its actively waiting for the value to arrive at that state, and we can interact with the ui ourself in this case to show how it passes once the value is actually that.

### Removing backend dependency
One big concern for flake is how your application interacts with its surroundings. A conventional solution is to add stuff to your application code for alternate execution paths where perhaps you don't call the backend etc. 

Cypress allows you to modify your applications external interactions without you needing to modify your application code. 

Lets write our first test to see it in practice. We already have the application running on 8080 and we can test that. 

```ts
  cy.visit('http://localhost:8080')
```

Notice that we start with some todos in there. Its not ideal, instead we should mock out the respose from this `get-all` api. See the response we are getting right now. And lets remove it starting a cypress `server`: 

```ts
  cy.server()
    .route('GET', '/api/get-all', { todos: [] })
  // continue with cy.visit 
```
And we can easily move it into its own file `utils/server.ts` file. And then call it in a `before` block in our tests. 

```ts
import { startServer } from "../utils/server";

before(() => {
  startServer();
})
```

If we play around with the ui we see there are calls to `POST``/add` and `PUT``/set-all`. Lets mock them out with our server as well. 

### TODO

* Create dynamic match somehow.
* One of the great things you can do with cypress is the ability to mock out the interactions of the appliation from its environment - Remove backend dependency when working with the test. 
* Now convert the behaviours to tests.

## Guide

* Set up Cypress and TypeScript - Cypress can easily be integrated into any web application in its own dedicated folder. In this lesson we cover how to add cypress with TypeScript support into an existing application without touching any of the existing code. This provides you with a reproducible pattern that you can carry out in your web applications along with a copy pasteable starting point so you don’t need to repeat these steps again and again.

* Command - Execution Separation in Cypress - Cypress works on top of commands. In this lesson we look at command / run separation along with best practices for chaining cypress commands. Cypress commands greatly improve your debugging experience with automatic logs and dom snapshots.

* Implicit Assertions and Automatic Retries in Cypress - We also cover implicit assertions and automatic retries which further decrease the noise in your test code and simultaneously increase test stability.

* Assert Behaviour with Cypress should Command - The should command is your key way to add assertions to cypress tests. It can be used to carry out chai / chai jquery assertions using chainers. In this lesson we take a look at this `.should` command.

* Reuse Application Config in a Cypress Test - You can use any of your browser application code in cypress tests. This is because cypress tests run the same way your browser code runs. In this lesson we cover how to create reusable config modules that remove the brittle coupling between conventional E2E tests and application code. 

* Unit Test Application Code with Cypress - Cypress can also be used for unit testing. In this lesson we demonstrate testing a piece of utility application logic in isolation (without navigating to a url) in a cypress test.

* Create and Interact with Reusable Page Objects in Cypress - A common testing convention is creating objects that provide a convenient handle for all the interactions that various tests need to do with a page. In this lesson we create a page object for cypress and then interact with it in tests. 

* Execute Multiple Cypress Commands in a Loop - In this lesson we look at cypress `each` command which can be used to carry out additional cypress commands in a loop.
