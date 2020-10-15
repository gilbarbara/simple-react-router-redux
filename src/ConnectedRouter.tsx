import * as React from 'react';
import { Router } from 'react-router-dom';
import { connect, ReactReduxContext, ReactReduxContextValue } from 'react-redux';
import { Dispatch } from 'redux';
import { Action, Location } from 'history';

import { onLocationChanged } from './actions';

import { ConnectedRouterProps, RouterLocation, RouterRootState } from './types';

class ConnectedRouter extends React.PureComponent<ConnectedRouterProps> {
  inTimeTravelling: boolean;
  unsubscribe: any;
  unlisten: any;

  constructor(props: ConnectedRouterProps) {
    super(props);
    const { history, onLocationChanged: onChanged, store } = this.props;

    this.inTimeTravelling = false;
    this.unsubscribe = store.subscribe(() => {
      // Extract store's location
      const {
        pathname: pathnameInStore,
        search: searchInStore,
        hash: hashInStore,
      } = store.getState().router.location;
      // Extract history's location
      const {
        pathname: pathnameInHistory,
        search: searchInHistory,
        hash: hashInHistory,
      } = history.location;

      // If we do time travelling, the location in store is changed but location in history is not changed
      /* istanbul ignore else */
      if (
        pathnameInHistory !== pathnameInStore ||
        searchInHistory !== searchInStore ||
        hashInHistory !== hashInStore
      ) {
        this.inTimeTravelling = true;
        // Update history's location to match store's location
        history.push({
          pathname: pathnameInStore,
          search: searchInStore,
          hash: hashInStore,
        });
      }
    });

    const handleLocationChange = (location: Location, action: Action) => {
      if (!this.inTimeTravelling) {
        onChanged(location, action);
      } else {
        this.inTimeTravelling = false;
      }
    };

    this.unlisten = history.listen(handleLocationChange);
    handleLocationChange(history.location, history.action);
  }

  componentWillUnmount() {
    this.unlisten();
    this.unsubscribe();
  }

  render() {
    const { children, history } = this.props;

    return <Router history={history}>{children}</Router>;
  }
}

const mapStateToProps = ({ router }: RouterRootState) => ({
  action: router.action,
  location: router.location,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLocationChanged: (location: RouterLocation<any>, action: Action) =>
    dispatch(onLocationChanged(location, action)),
});

const ConnectedRouterWithContext = (props: any) => {
  const { context } = props;
  const Context = context || ReactReduxContext;

  /* istanbul ignore next */
  if (Context == null) {
    throw new Error('Please upgrade to react-redux v6');
  }

  return (
    <Context.Consumer>
      {({ store }: ReactReduxContextValue) => <ConnectedRouter store={store} {...props} />}
    </Context.Consumer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedRouterWithContext);
