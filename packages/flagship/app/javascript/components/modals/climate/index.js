import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ location }) => ({
  open: location && location.query && location.query.gfwclimate
});

reducerRegistry.registerModule('modalGFWClimate', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, { ...actions, setModalContactUsOpen })(
  Component
);
