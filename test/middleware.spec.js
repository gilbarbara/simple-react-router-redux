import configureStore from 'redux-mock-store';
import { CALL_HISTORY_METHOD, routerMiddleware } from '../src';

describe('Middleware', () => {
  it('calls history method based on action payload values', () => {
    const history = {
      location: {},
      action: 'POP',
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
    };
    const middlewares = [routerMiddleware(history)];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});

    // push
    store.dispatch({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'push',
        args: ['/path/to/somewhere'],
      },
    });
    expect(history.push).toBeCalledWith('/path/to/somewhere');

    // replace
    store.dispatch({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'replace',
        args: ['/path/to/somewhere'],
      },
    });
    expect(history.replace).toBeCalledWith('/path/to/somewhere');

    // go
    store.dispatch({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'go',
        args: [5],
      },
    });
    expect(history.go).toBeCalledWith(5);

    // goBack
    store.dispatch({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'goBack',
        args: [],
      },
    });
    expect(history.goBack).toBeCalled();

    // goForward
    store.dispatch({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'goForward',
        args: [],
      },
    });
    expect(history.goForward).toBeCalled();
  });

  it('passes to next middleware if action type is not CALL_HISTORY_METHOD', () => {
    const spy = jest.fn();
    // eslint-disable-next-line no-unused-vars
    const nextMiddleware = () => () => action => {
      spy(action);
    };
    const history = {};
    const middleware = [routerMiddleware(history), nextMiddleware];
    const mockStore = configureStore(middleware);
    const store = mockStore();
    const action = {
      type: 'NOT_HANDLE_ACTION',
      payload: {
        text: 'Hello',
      },
    };

    store.dispatch(action);
    expect(spy).toBeCalledWith(action);
  });
});
