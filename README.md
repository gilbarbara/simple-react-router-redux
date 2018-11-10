# simple-react-router-redux

[![NPM version](https://badge.fury.io/js/simple-react-router-redux.svg)](https://www.npmjs.com/package/simple-react-router-redux) [![build status](https://travis-ci.org/gilbarbara/simple-react-router-redux.svg)](https://travis-ci.org/gilbarbara/simple-react-router-redux) [![Maintainability](https://api.codeclimate.com/v1/badges/c7e42fe511b80cc25760/maintainability)](https://codeclimate.com/github/gilbarbara/simple-react-router-redux/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/2fb41194cfedcefc7358/test_coverage)](https://codeclimate.com/github/gilbarbara/simple-react-router-redux/test_coverage)

Redux bindings for react-router v4. A tiny fork of [connected-react-router](https://github.com/supasate/connected-react-router)

## Setup

```bash
npm install simple-react-router-redux
```

## Usage

Setup your own history module:

```js
import { createBrowserHistory } from 'history';

export default createBrowserHistory();
```


And configure the store:

```js
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'simple-react-router-redux';

import rootReducer from './reducers';
import history from './history';

// Combine your reducers with connectRouter.
const reducers = combineReducers({
  ...rootReducer,
  router: connectRouter(history),
});

const store = createStore(
  reducers, // root reducer with router state
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      // ... other middlewares ...
    ),
  ),
);
```


Now just wrap your routes with ConnectedRouter with the same history module

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'simple-react-router-redux';

import history from './history';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route exact path="/" render={() => (<div>Match</div>)} />
          <Route render={() => (<div>Miss</div>)} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react')
);
```



Enjoy!


## License

[MIT License](./LICENSE.md)
