import { connect } from 'react-redux';

import * as actions from 'components/modals/video/video-actions';
import PageComponent from './component';

import config from './config';

const mapStateToProps = ({ news }) => ({
  news: news && news.data,
  newsLoading: news && news.loading,
  ...config
});

export default connect(mapStateToProps, actions)(PageComponent);
