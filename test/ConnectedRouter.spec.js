/* eslint-disable import/no-named-default */
import { mount, default as Enzyme } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';

import * as actions from '../src/actions';
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
  LOCATION_CHANGE,
} from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('ConnectedRouter', () => {
  let history;
  let onLocationChangedSpy;
  let store;
  let wrapper;

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
      <ConnectedRouter history={history}>
        <Route path="/" render={() => <div>Home</div>} />
      </ConnectedRouter>,
      {
        context: {
          store,
        },
        childContextTypes: {
          store: PropTypes.object,
        },
      },
    );
  });

  it('calls `props.onLocationChanged()` on mount', () => {
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(1);
  });

  it('calls `props.onLocationChanged()` when pathname changes.', () => {
    history.push('/one');

    expect(onLocationChangedSpy).toHaveBeenCalledTimes(2);
  });

  it('calls `props.onLocationChanged()` when search changes.', () => {
    history.push({ search: '?cache=11122' });

    expect(store.getState().router.location.search).toBe('?cache=11122');
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(3);
  });

  it('calls `props.onLocationChanged()` when hash changes.', () => {
    history.push({ hash: 'profile' });

    expect(store.getState().router.location.hash).toBe('#profile');
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(4);
  });

  it('calls `props.onLocationChanged()` when state changes.', () => {
    history.push({ state: { modal: true } });

    expect(store.getState().router.location.state).toEqual({ modal: true });
    expect(onLocationChangedSpy).toHaveBeenCalledTimes(5);
  });

  it('calls `history.push()` when the store location differs from history', () => {
    expect(history.location.pathname).toBe('/one');

    store.dispatch({
      type: LOCATION_CHANGE,
      payload: {
        location: {
          ...store.getState().router.location,
          pathname: '/two',
        },
      },
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
