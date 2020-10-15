import { History } from 'history';
import { CALL_HISTORY_METHOD } from './actions';

import { RouterAction, RouterMiddleware } from './types';

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
const routerMiddleware: RouterMiddleware = (history: History) => () => next => (
  action: RouterAction,
) => {
  if (action.type !== CALL_HISTORY_METHOD) {
    next(action);

    return;
  }

  const { method, args } = action.payload;
  // @ts-ignore
  history[method](...args);
};

export default routerMiddleware;
