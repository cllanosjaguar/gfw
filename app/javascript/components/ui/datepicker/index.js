import { connect } from 'react-redux';
import { getActiveLang } from 'utils/lang';

import Component from './component';

const mapStateToProps = () => ({
  lang: getActiveLang()
});

export default connect(mapStateToProps)(Component);
