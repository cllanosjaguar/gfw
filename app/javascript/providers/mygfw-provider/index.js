import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import { setUserToken } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class MyGFWProvider extends PureComponent {
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  selectLocalToken = () =>
  typeof window !== 'undefined'
    ? localStorage && localStorage.getItem('mygfw_token')
    : '';

  componentDidMount() {
    const { getUserProfile, router } = this.props;
    const { query, push, pathname } = router;
    const urlToken = query?.token;

    if (urlToken) {
      setUserToken(urlToken);
      delete query.token;
      push({
        pathname,
        query
      });
    }

    getUserProfile(query?.token);
  }

  render() {
    return null;
  }
}

export const reduxModule = {
  actions,
  reducers,
  initialState,
};

export default withRouter(connect(null, actions)(MyGFWProvider));
