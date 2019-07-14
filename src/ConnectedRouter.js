import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { connect, ReactReduxContext } from 'react-redux';

import { onLocationChanged } from './actions';

class ConnectedRouter extends React.Component {
  constructor(props) {
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

    const handleLocationChange = (location, action) => {
      if (!this.inTimeTravelling) {
        onChanged(location, action);
      } else {
        this.inTimeTravelling = false;
      }
    };

    this.unlisten = history.listen(handleLocationChange);
    handleLocationChange(history.location, history.action);
  }

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    history: PropTypes.shape({
      action: PropTypes.string.isRequired,
      listen: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    onLocationChanged: PropTypes.func.isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    this.unlisten();
    this.unsubscribe();
  }

  render() {
    const { children, history } = this.props;

    return <Router history={history}>{children}</Router>;
  }
}

const mapStateToProps = ({ router }) => ({
  action: router.action,
  location: router.location,
});

const mapDispatchToProps = dispatch => ({
  onLocationChanged: (location, action) =>
    dispatch(onLocationChanged(location, action)),
});

const ConnectedRouterWithContext = props => {
  const { context } = props;
  const Context = context || ReactReduxContext;

  /* istanbul ignore next */
  if (Context == null) {
    throw new Error('Please upgrade to react-redux v6');
  }

  return (
    <Context.Consumer>
      {({ store }) => <ConnectedRouter store={store} {...props} />}
    </Context.Consumer>
  );
};

ConnectedRouterWithContext.propTypes = {
  context: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedRouterWithContext);
