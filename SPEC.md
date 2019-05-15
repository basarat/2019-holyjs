# No todos
- When there are no todos, the main list and the footer should be hidden.

# New todo
- The input element should be focused when the page is loaded. 
- New todos are entered in the input at the top of the app. 
- Pressing Enter creates the todo, appends it to the todo list, and clears the input. 
- Make sure to '.trim()' the input and then check that it's not empty before creating a new todo. 

# Item
- Starts off unchecked
- Clicking the checkbox toggles the todo active/complete
- Clicking the remove button should remove it item

# Edit item
- Double-clicking the todo label activates editing mode
- The edit mode should exit on enter, blur and escape
- Enter results in a commit
- Blur results in a commit
- The *commit* is done after trim
- If the trim results in an empty value, the commit should destroy the item
- Escape does not result in a commit

# Toggle all
- Should not be visible when there are no todos.
- If any todo is not complete it should not be checked.
- When all the todos are checked it should also get checked.

This checkbox toggles all the todos to the same state as itself. 
- When clicked, If it is not checked, it checks all todos.
- When clicked, If it is checked, it unchecks all todos.

# Counter
- Is not displayed when there are no items
- Displays the number of active todos in a pluralized form e.g. "0 items left", "1 item left", "2 items left"

# Clear completed button
- Should be hidden when there are no completed todos
- Should be visible when there are completed todos
- Clicking it removes completed todos 

# Routing
The following routes should be implemented: 
- "#/" (default) - all items are shown. The all link is selected
- "#/active" - Only active items are shown. The active link is selected
- "#/completed" - Only completed items are shown. The completed link is selected

Live filtering:
- "#/active" - Items should move out if checked
- "#/completed" - Items should move out if unchecked