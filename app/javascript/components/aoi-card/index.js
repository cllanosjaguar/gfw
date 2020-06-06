import { connect } from 'react-redux';
import { getActiveLang } from 'utils/lang';

import Component from './component';

export default connect(state => ({
  lang: getActiveLang(state)
}))(Component);
