import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useRouter from 'utils/router';

import { setUserToken } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class MyGFWProvider extends PureComponent {
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { getUserProfile } = this.props;
    const { query, push, pathname } = useRouter();
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

export default connect(null, actions)(MyGFWProvider);
