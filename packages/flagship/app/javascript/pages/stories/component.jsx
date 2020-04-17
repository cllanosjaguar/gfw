import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import treeImage from 'assets/icons/tree-success.png';

import './styles.scss';

class StoriesPage extends PureComponent {
  static propTypes = {
    setModalContactUsOpen: PropTypes.func
  };

  render() {
    const { setModalContactUsOpen } = this.props;
    return (
      <div className="l-stories-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="stories-message">
              <img src={treeImage} alt="stories-tree" />
              <p>
                Due to limited use, the user stories feature is no longer
                available on GFW. Please{' '}
                <button onClick={() => setModalContactUsOpen(true)}>
                  contact us
                </button>{' '}
                if you have any questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StoriesPage;
