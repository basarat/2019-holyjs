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

### Spec 

```js
`
### No todos

When there are no todos, '#main' and '#footer' should be hidden.

### New todo

New todos are entered in the input at the top of the app. The input element should be focused when the page is loaded, preferably by using the 'autofocus' input attribute. Pressing Enter creates the todo, appends it to the todo list, and clears the input. Make sure to '.trim()' the input and then check that it's not empty before creating a new todo.

### Mark all as complete

This checkbox toggles all the todos to the same state as itself. Make sure to clear the checked state after the "Clear completed" button is clicked. The "Mark all as complete" checkbox should also be updated when single todo items are checked/unchecked. Eg. When all the todos are checked it should also get checked.

### Item

A todo item has three possible interactions:

1. Clicking the checkbox marks the todo as complete by updating its 'completed' value and toggling the class 'completed' on its parent '<li>'

2. Double-clicking the '<label>' activates editing mode, by toggling the '.editing' class on its '<li>'

3. Hovering over the todo shows the remove button ('.destroy')

### Editing

When editing mode is activated it will hide the other controls and bring forward an input that contains the todo title, which should be focused ('.focus()'). The edit should be saved on both blur and enter, and the 'editing' class should be removed. Make sure to '.trim()' the input and then check that it's not empty. If it's empty the todo should instead be destroyed. If escape is pressed during the edit, the edit state should be left and any changes be discarded.

### Counter

Displays the number of active todos in a pluralized form. Make sure the number is wrapped by a '<strong>' tag. Also make sure to pluralize the 'item' word correctly: '0 items', '1 item', '2 items'. Example: **2** items left

### Clear completed button

Removes completed todos when clicked. Should be hidden when there are no completed todos.

### Persistence

Your app should dynamically persist the todos to localStorage. If the framework has capabilities for persisting data (e.g. Backbone.sync), use that. Otherwise, use vanilla localStorage. If possible, use the keys 'id', 'title', 'completed' for each item. Make sure to use this format for the localStorage name: 'todos-[framework]'. Editing mode should not be persisted.

### Routing

Routing is required for all implementations. If supported by the framework, use its built-in capabilities. Otherwise, use the  [Flatiron Director](https://github.com/flatiron/director) routing library located in the '/assets' folder. The following routes should be implemented: '#/' (all - default), '#/active' and '#/completed' ('#!/' is also allowed). When the route changes, the todo list should be filtered on a model level and the 'selected' class on the filter links should be toggled. When an item is updated while in a filtered state, it should be updated accordingly. E.g. if the filter is 'Active' and the item is checked, it should be hidden. Make sure the active filter is persisted on reload.
`
```

### No todos 

```ts
  it('No todos', () => {
    visit();
    /** When there are no todos, '#main' and '#footer' should be hidden. */
    cy.get('#main').should('not.be.visible');
    cy.get('#footer').should('not.be.visible');
  });
```

At this point I'm going to move out the `visit` to `beforeEach` as well as that is exactly what it is for.

### New todos

```ts
    /** 
     * New todos are entered in the input at the top of the app. 
     * The input element should be focused when the page is loaded, preferably by using the 'autofocus' input attribute. 
     * Pressing Enter creates the todo, appends it to the todo list, and clears the input. 
     * Make sure to '.trim()' the input and then check that it's not empty before creating a new todo. 
     */

    cy.focused().should('have.class', selectors.newTodoInput.substr(1));

    cy.get(selectors.newTodoInput).type('Hello world  ').type('{enter}');
    cy.get(selectors.todoListItems).last().invoke('text').should('eq', 'Hello world');
```

### Mark as complete 

```ts
    /** 
     * This checkbox toggles all the todos to the same state as itself. 
     * Make sure to clear the checked state after the "Clear completed" button is clicked. 
     * The "Mark all as complete" checkbox should also be updated when single todo items are checked/unchecked. Eg. When all the todos are checked it should also get checked.
     */

    // Initial state
    cy.get(selectors.toggleAllCheckbox).should('not.be.visible');

    // When nothing is checked 
    addTodo('Hello');
    addTodo('World');
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When there is a mix of checked and not checked items
    cy.get(selectors.itemCheckBoxByIndex(0)).click();
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When they are all checked
    cy.get(selectors.itemCheckBoxByIndex(1)).click();
    cy.get(selectors.toggleAllCheckbox).should('be.checked');

    // When toggle all is in checked state and clicked
    cy.get(selectors.toggleAllCheckbox).click();
    cy.get(selectors.itemCheckBoxByIndex(0)).should('not.be.checked');
    cy.get(selectors.itemCheckBoxByIndex(1)).should('not.be.checked');
    cy.get(selectors.toggleAllCheckbox).should('not.be.checked');

    // When toggle all is not in checked state and clicked
    cy.get(selectors.toggleAllCheckbox).click();
    cy.get(selectors.itemCheckBoxByIndex(0)).should('be.checked');
    cy.get(selectors.itemCheckBoxByIndex(1)).should('be.checked');
    cy.get(selectors.toggleAllCheckbox).should('be.checked');
```

### Item 
* We will do the edit mode later. 

### TODO

* Now convert the behaviours to tests.
* Seperate behaviours into `describe` and `it` section. 
* Setup to run on travis.
* Talk about ordering the tests, e.g. moving the item test *before* others as there is a dependency there.