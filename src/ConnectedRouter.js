import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router';
import { connect } from 'react-redux';

import { onLocationChanged } from './actions';

class ConnectedRouter extends React.Component {
  constructor(props, context) {
    super(props);
    const { history, onLocationChanged: onChanged } = this.props;

    this.inTimeTravelling = false;
    this.unsubscribe = context.store.subscribe(() => {
      // Extract store's location
      const {
        pathname: pathnameInStore,
        search: searchInStore,
        hash: hashInStore,
      } = context.store.getState().router.location;
      // Extract history's location
      const {
        pathname: pathnameInHistory,
        search: searchInHistory,
        hash: hashInHistory,
      } = history.location;

      // If we do time travelling, the location in store is changed but location in history is not changed
      if (pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInHistory !== hashInStore) {
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
      }
      else {
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
  };

  static contextTypes = {
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

    return (
      <Router history={history}>
        {children}
      </Router>
    );
  }
}

const mapStateToProps = ({ router }) => ({
  action: router.action,
  location: router.location,
});

const mapDispatchToProps = dispatch => ({
  onLocationChanged: (location, action) => dispatch(onLocationChanged(location, action)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedRouter);
