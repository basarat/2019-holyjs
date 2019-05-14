
# 000 NoTodos
```ts
  it('The main list and footer should be hidden', () => {
    cy.get(page.selectors.mainList).should('not.be.visible');
    cy.get(page.selectors.footer).should('not.be.visible');
  });
```

# 010 NewTodo
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

# 020 Item
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

# 030 Edit item
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

# 040 Mark all as complete 
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

# 050 Counter
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

# 060 Clear Completed Button 
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

# 070 Routing
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