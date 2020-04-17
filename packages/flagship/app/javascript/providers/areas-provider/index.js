import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAreasProps } from './selectors';

class AreasProvider extends PureComponent {
  static propTypes = {
    getAreasProvider: PropTypes.func.isRequired,
    getAreaProvider: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object
  };

  componentDidMount() {
    const { getAreaProvider, loggedIn, location, loading } = this.props;
    if (!loading && loggedIn) {
      this.handleGetAreas();
    }

    if (!loading && location.type === 'aoi' && !loggedIn) {
      getAreaProvider(location.adm0);
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, loading } = this.props;
    const { loggedIn: prevLoggedIn } = prevProps;

    if (!loading && loggedIn && loggedIn !== prevLoggedIn) {
      this.handleGetAreas();
    }
  }

  handleGetAreas = () => {
    const { getAreasProvider } = this.props;
    this.cancelAreasFetch();
    this.areasFetch = CancelToken.source();

    getAreasProvider(this.areasFetch.token);
  };

  cancelAreasFetch = () => {
    if (this.areasFetch) {
      this.areasFetch.cancel('Cancelling areas fetches');
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('areas', {
  actions,
  reducers,
  initialState
});

export default connect(getAreasProps, actions)(AreasProvider);
