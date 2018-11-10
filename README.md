# simple-react-router-redux

Redux bindings for react-router v4. A tiny fork of [connected-react-router](https://github.com/supasate/connected-react-router)

## Setup

```bash
npm install connected-react-router
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
import { ConnectedRouter } from 'connected-react-router';

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