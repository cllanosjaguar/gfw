import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

const BrowserPage = (props) => (
  <Layout {...props}>
    <div className="l-browser-support-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <ConfirmationMessage
            title={props.title}
            description={props.description}
            error
          />
        </div>
      </div>
    </div>
  </Layout>
);

BrowserPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default BrowserPage;
