import * as React from 'react';
import { Route } from 'react-router-dom';
import { ReactReduxContext } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import { createBrowserHistory, History } from 'history';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import * as actions from '../src/actions';
import { ConnectedRouter, connectRouter, LOCATION_CHANGE, routerMiddleware } from '../src';

function MockProvider(props: any) {
  const { children, store } = props;
  const Context = ReactReduxContext;

  return (
    <Context.Provider
      value={{
        storeState: store.getState(),
        store,
      }}
    >
      {React.Children.only(children)}
    </Context.Provider>
  );
}

describe('ConnectedRouter', () => {
  let history: History;
  let onLocationChangedSpy: any;
  let store: Store;
  let wrapper: ReactWrapper;

  beforeAll(() => {
    onLocationChangedSpy = jest.spyOn(actions, 'onLocationChanged');

    history = createBrowserHistory();

    store = createStore(
      combineReducers({
        router: connectRouter(history),
      }), // root reducer with router state
      {},
      compose(applyMiddleware(routerMiddleware(history))),
    );

    wrapper = mount(
      <MockProvider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" render={() => <div>Home</div>} />
        </ConnectedRouter>
      </MockProvider>,
    );
  });

  it('calls it on mount', () => {
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(1);
  });

  it('calls it when pathname changes.', () => {
    act(() => {
      history.push('/one');
    });

    expect(onLocationChangedSpy).toHaveBeenCalledTimes(2);
  });

  it('calls it when search changes.', () => {
    act(() => {
      history.push({ search: '?cache=11122' });
    });

    expect(store.getState().router.location.search).toBe('?cache=11122');
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(3);
  });

  it('calls it when hash changes.', () => {
    act(() => {
      history.push({ hash: 'profile' });
    });

    expect(store.getState().router.location.hash).toBe('#profile');
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(4);
  });

  it('calls it when state changes.', () => {
    act(() => {
      history.push({ state: { modal: true } });
    });

    expect(store.getState().router.location.state).toEqual({ modal: true });
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(5);
  });

  it('calls `history.push()` when the store location differs from history', () => {
    expect(history.location.pathname).toBe('/one');

    act(() => {
      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            ...store.getState().router.location,
            pathname: '/two',
          },
        },
      });
    });

    expect(history.location.pathname).toBe('/two');
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(5);
  });

  it('unlistens the history object when unmounted.', () => {
    wrapper.unmount();

    history.push('/new-location-after-unmounted');

    expect(onLocationChangedSpy).toHaveBeenCalledTimes(5);
  });
});
