import { CALL_HISTORY_METHOD } from './actions';

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
const routerMiddleware = (history) => () => next => action => {
  if (action.type !== CALL_HISTORY_METHOD) {
    next(action);
    return;
  }

  const { payload: { method, args } } = action;
  history[method](...args);
};

export default routerMiddleware;
