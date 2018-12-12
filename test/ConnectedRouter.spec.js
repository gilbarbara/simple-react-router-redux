/* eslint-disable import/no-named-default, react/no-unused-state */
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { ReactReduxContext } from 'react-redux';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';

import * as actions from '../src/actions';
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
  LOCATION_CHANGE,
} from '../src';

configure({ adapter: new Adapter() });

class MockProvider extends React.Component {
  constructor(props) {
    super(props);
    const { store } = props;

    this.state = {
      storeState: store.getState(),
      store,
    };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const { children } = this.props;
    const Context = ReactReduxContext;

    return (
      <Context.Provider value={this.state}>
        {React.Children.only(children)}
      </Context.Provider>
    );
  }
}

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
      <MockProvider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" render={() => <div>Home</div>} />
        </ConnectedRouter>
      </MockProvider>,
    );
  });

  describe('props.onLocationChanged', () => {
    it('calls it on mount', () => {
      expect(onLocationChangedSpy).toHaveBeenCalledTimes(1);
    });

    it('calls it when pathname changes.', () => {
      history.push('/one');

      expect(onLocationChangedSpy).toHaveBeenCalledTimes(2);
    });

    it('calls it when search changes.', () => {
      history.push({ search: '?cache=11122' });

      expect(store.getState().router.location.search).toBe('?cache=11122');
      expect(onLocationChangedSpy).toHaveBeenCalledTimes(3);
    });

    it('calls it when hash changes.', () => {
      history.push({ hash: 'profile' });

      expect(store.getState().router.location.hash).toBe('#profile');
      expect(onLocationChangedSpy).toHaveBeenCalledTimes(4);
    });

    it('calls it when state changes.', () => {
      history.push({ state: { modal: true } });

      expect(store.getState().router.location.state).toEqual({ modal: true });
      expect(onLocationChangedSpy).toHaveBeenCalledTimes(5);
    });
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
