import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as typestyle from 'typestyle';

import { loadTodoMVCCSS } from './todomvc/css';
import { App } from './components/components';


loadTodoMVCCSS();

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
typestyle.forceRenderStyles();
