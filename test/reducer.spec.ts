import { combineReducers } from 'redux';
import { createBrowserHistory, History } from 'history';
import { LOCATION_CHANGE, connectRouter } from '../src';

describe('connectRouter', () => {
  let mockHistory: History;

  beforeEach(() => {
    mockHistory = {
      ...createBrowserHistory(),
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: {},
      },
      action: 'POP',
    };
  });

  it('creates new root reducer with router reducer inside', () => {
    const mockReducer = (state = {}) => {
      return state;
    };
    const rootReducer = combineReducers({
      mock: mockReducer,
      router: connectRouter(mockHistory),
    });

    const currentState = {
      mock: {},
      router: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        action: 'POP',
      },
    };
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/path/to/somewhere',
          search: '?query=test',
          hash: '',
        },
        action: 'PUSH',
      },
    };
    const nextState = rootReducer(currentState, action);
    const expectedState = {
      mock: {},
      router: {
        location: {
          pathname: '/path/to/somewhere',
          search: '?query=test',
          hash: '',
        },
        action: 'PUSH',
      },
    };
    expect(nextState).toEqual(expectedState);
  });

  it('does not change state ref when action does not trigger any reducers', () => {
    const rootReducer = combineReducers({
      router: connectRouter(mockHistory),
    });

    const currentState = {
      router: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        action: 'POP',
      },
    };
    const nextState = rootReducer(currentState, { type: 'TEST' });

    expect(nextState).toBe(currentState);
  });
});
