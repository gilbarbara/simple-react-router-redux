import { LOCATION_CHANGE } from './actions';

export default history => {
  const initialRouterState = {
    location: history.location,
    action: history.action,
  };

  /*
   * This reducer will update the state with the most recent location history
   * has transitioned to.
   */
  return (state = initialRouterState, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      return {
        ...state,
        ...payload,
      };
    }

    return state;
  };
};
