const selectors = {
  newTodoInput: '.new-todo',
  todoListItems: '.todo-list label',

  all: '[data-test=all]',
  active: '[data-test=active]',
  completed: '[data-test=completed]',
}

export const addTodo = (text: string) => {
  cy.get(selectors.newTodoInput).type(text).type('{enter}');
}
