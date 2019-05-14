# Maintainable web application testing with cypress
> Testing how it should be

https://docs.google.com/presentation/d/1GkosEbTLBNZM4n9g9FXDBsSTl1D2IzcHePplTZ3PRwI/edit?usp=sharing


## Setup 
Setup the `webapp`: 
* cd webapp
* `npm install`
* `npm start`

Setup `e2e`:
* cd e2e
* `npm install`
* `npm start`

# Script 

--- SLIDE --- 

## Cypress Concepts
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

----- SLIDE -------

## App 
* Show the app running 
  * Add, remove, mark as complete - filter. Preserved on reload.

----- SLIDE -------

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
And we can easily move it into its own file `utils/server.ts` file. And then call it in a `beforeEach` block in our tests. 

```ts
import { startServer } from "../utils/server";

beforeEach(() => {
  startServer();
})
```

### Init backend dependency

If we play around with the ui we see there are calls to `POST``/add` and `PUT``/set-all`. We could start mocking all of these all well and at that point you will be re-creating your backend. So think about it for a second and you will realize that the whole objective here is to ensure that the application starts in a known good state. So what you really want is `init` the server instead of starting to mock these out. 

```ts
cy.request('PUT', 'http://localhost:3000/api/set-all', { todos: [] })
```

These are true E2E tests. Also equate to the "large" definition used by google https://testing.googleblog.com/2010/12/test-sizes.html


----- SLIDE -------


### Creating page objects 
* `cypress/utils/page/todoPage`

* create selectors. Show playground selector for links at the bottom.
* create actions

* add to test to show 
```ts
  addTodo('one');
  addTodo('two');

  cy.contains('one');
  cy.contains('two');
```

* create and use `visit`.
```ts
export const visit = () => {
  cy.visit('http://localhost:8080');
}
```

---- SLIDE: Behaviour vs. spec  ----


## Write Specs 

# NoTodos
```ts
  it('The main list and footer should be hidden', () => {
    cy.get(page.selectors.mainList).should('not.be.visible');
    cy.get(page.selectors.footer).should('not.be.visible');
  });
```

# NewTodo
```ts
  it('The input element should be focused when the page is loaded.', () => {
    cy.focused().should('have.class', page.selectors.newTodoInput.substr(1));
  });
  it('Create by enter, adds it to the list', () => {
    cy.get(page.selectors.newTodoInput).type('Hello world').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello world');
  });
  it('Empty input after adding', () => {
    cy.get(page.selectors.newTodoInput).type('Hello world').type('{enter}');
    cy.get(page.selectors.newTodoInput).should('have.text', '');
  });
  it('Trim before adding', () => {
    cy.get(page.selectors.newTodoInput).type(' Hello world ').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello world');
  });
  it('Don\'t create if empty', () => {
    cy.get(page.selectors.newTodoInput).type('  ').type('{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
```

# Item
```ts
  it('Starts of unchecked', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
  });
  it('Clicking the checkbox toggles the todo active/complete', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
  });
  it('Clicking the remove button should remove it item', () => {
    page.addTodo('Hello world');
    cy.get(page.selectors.itemDestroyByIndex(0)).invoke('show').click();
    cy.get('Hello World').should('not.exist');
  });
```

# Edit item
```ts
it('Double-clicking the todo label activates editing mode', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).should('exist');
  });
  it('The edit mode should exit on enter, blur and escape', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{enter}').should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).blur().should('not.exist');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type('{esc}').should('not.exist');
  });
  it('Enter results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{enter}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('Blur results in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('The *commit* is done after trim', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World ').blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello World');
  });
  it('If the trim results in an empty value, the commit should destroy the item', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).clear().blur();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
  it('Escape does not result in a commit', () => {
    page.addTodo('Hello');

    cy.get(page.selectors.itemLabelByIndex(0)).dblclick();
    cy.get(page.selectors.itemEditByIndex(0)).type(' World{esc}');
    cy.get(page.selectors.itemLabelByIndex(0)).should('have.text', 'Hello');
  });
```

# Mark all as complete 
```ts
it('should not be visible when there are no todos', () => {
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.visible');
  });
  it('If any todo is not complete it should not be checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    /** When nothing is checked */
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
    /** When mixed */
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
  it('When all the todos are checked it should also get checked.', () => {
    page.addTodo('Hello');
    page.addTodo('World');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemCheckBoxByIndex(1)).click();
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');
  });
  it('This checkbox toggles all the todos to the same state as itself', () => {
    page.addTodo('Hello');
    page.addTodo('World');

    /** When clicked, If it is not checked, it checks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('be.checked');

    /** When clicked, If it is checked, it unchecks all todos. */
    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(page.selectors.itemCheckBoxByIndex(1)).should('not.be.checked');
    cy.get(page.selectors.toggleAllCheckbox).should('not.be.checked');
  });
```

# Counter
```ts
it('Is not displayed when there are no items', () => {
    cy.get(page.selectors.todoCount).should('not.exist');
  });
  it('Displays the number of active todos in a pluralized form e.g. "0 items left", "1 item left", "2 items left"', () => {
    page.addTodo('Hello World');
    cy.get(page.selectors.todoCount).should('have.text', '1 item left');

    page.addTodo('Again');
    cy.get(page.selectors.todoCount).should('have.text', '2 items left');

    cy.get(page.selectors.toggleAllCheckbox).click();
    cy.get(page.selectors.todoCount).should('have.text', '0 items left');
  });
```

# Clear Completed Button 
```ts
 it('Should be hidden when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.clearCompleted).should('not.exist');
  });
  it('Should be visible when there are no completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).should('exist');
  });
  it('Clicking it removes completed todos', () => {
    page.addTodo('Hello');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.clearCompleted).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
```

# Routing
```ts
  beforeEach(() => {
    page.addTodo('Completed');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    page.addTodo('InProgress');
  });
  it('"#/" (default) - all items are shown. The all link is selected', () => {
    cy.get(page.selectors.all).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['Completed', 'InProgress']);
  });
  it('"#/active" - Only active items are shown. The active link is selected', () => {
    cy.visit('#/active');
    cy.get(page.selectors.active).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['InProgress']);
  });
  it('"#/completed" - Only completed items are shown. The completed link is selected', () => {
    cy.visit('#/completed');
    cy.get(page.selectors.completed).should('have.class', 'selected');
    page.getAllTodos().should('deep.equal', ['Completed']);
  });
  it('"#/active" - Items should move out if checked', () => {
    cy.visit('#/active');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
  it('"#/completed" - Items should move out if unchecked', () => {
    cy.visit('#/completed');
    cy.get(page.selectors.itemCheckBoxByIndex(0)).click();
    cy.get(page.selectors.itemLabelByIndex(0)).should('not.exist');
  });
```